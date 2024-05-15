package com.dance101.steptodance.global.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import net.bramp.ffmpeg.probe.FFmpegStream;

import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.global.exception.data.response.ErrorCode;
import com.dance101.steptodance.guide.data.request.Frame;
import com.dance101.steptodance.guide.data.request.MessageRequest;
import com.dance101.steptodance.guide.service.AIServerService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FFmpegUtils {
	private final String ffmpegPath;
	private final String ffprobePath;
	private FFmpeg ffmpeg;
	private FFprobe ffprobe;
	private final String outputDirPath = "data/vod/output";
	private final AIServerService aiServerService;

	public FFmpegUtils(
		@Value("${ffmpeg.location}")String ffmpegPath,
		@Value("${ffprobe.location}")String ffprobePath,
		AIServerService aiServerService) throws IOException
	{
		this.ffmpegPath = ffmpegPath;
		this.ffprobePath = ffprobePath;
		this.aiServerService = aiServerService;
		ffmpeg = new FFmpeg(this.ffmpegPath);
		ffprobe = new FFprobe(this.ffprobePath);
	}

	public Path saveInTmpLocal(MultipartFile video) throws IOException {
		Path tempFilePath = Files.createTempFile("temp-", ".mp4");
		video.transferTo(tempFilePath);
		return tempFilePath;
	}

	public Path setVodFrame30(Path path) throws IOException {
		Path tempFilePath = Files.createTempFile("temp-", ".mp4");

		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(path.toString())
			.addOutput(tempFilePath.toString())
			.setVideoFrameRate(30, 1)
			.done();

		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();

		Files.delete(path);

		return tempFilePath;
	}

	public Path setVodCenterOnHuman(Path path, long id, List<Frame<Double>> frameList) throws IOException {
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(path.toString())
			.addOutput(outputDirPath+"guide"+id+"/frame_%05d.png")
			.setVideoFrameRate(30, 1) // 1초에 30프레임 추출
			.done();

		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();

		FFprobe ffprobe = new FFprobe("ffprobe"); // FFprobe 실행 파일 경로 설정
		FFmpegProbeResult probeResult = ffprobe.probe(path.toString());

		// FFmpegProbeResult에서 스트림 정보 가져오기
		FFmpegStream videoStream = probeResult.getStreams().stream()
			.filter(stream -> stream.codec_type == FFmpegStream.CodecType.VIDEO)
			.findFirst()
			.orElse(null);

		if (videoStream == null) {
			throw new NotFoundException("setVodCenterOnHuman: 비디오를 찾지 못했습니다.", ErrorCode.GUIDE_NOT_FOUND);
		}

		int width = videoStream.width;
		int height = videoStream.height;
		width = (int)(double)height/16*9;
		int halfWidth = width / 2;

		for (int i = 1; i <= frameList.size(); i++) {
			// movenet 모델
			int x = 0;
			for (int j = 0; j <= 17; j++) {
				x += frameList.get(i).getModel().get(j).get(0);
			}
			x /= 17;
			builder.setInput(outputDirPath + "guide" + id + String.format("/frame_%05d.png", i));
			builder.addOutput(outputDirPath + "guide" + id + String.format("/frame_%05d.png", i));
			builder.setVideoFilter("crop="+ (x - halfWidth) +":in_h:" + width + ":0");
			// TODO: 로그 지우기
			log.info("humanCenterMethod: {" + "crop="+ (x - halfWidth) +":in_h:" + width + ":0" + "}");
			executor.createJob(builder).run();;
		}
		FFmpegBuilder vodBuilder = new FFmpegBuilder()
			.setInput(outputDirPath + "guide" + id + "/frame_%05d.png")
			.addOutput(outputDirPath + "guide" + id + "/result.mp4")
			.setVideoCodec("libx264") // 비디오 코덱 설정
			.setStrict(FFmpegBuilder.Strict.EXPERIMENTAL) // 실험적 옵션 사용
			.done();
		executor.createJob(vodBuilder).run();;
		// TODO : 노래를 그대로 가져오기

		return Path.of(outputDirPath + "guide" + id + "/result.mp4");
	}


	/**
	 *
	 * @param id
	 * @param vodPath
	 * @return 멀티파트 이미지 파일. 썸네일로 사용
	 * @throws IOException
	 */
	public MultipartFile sendVodToKafkaGuide(long id, Path vodPath) throws IOException {
		String type = "guide";
		Files.createDirectories(Path.of(outputDirPath + type + id));

		// 동영상 파일 -> 모든 프레임 이미지 (30)
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(vodPath.toString())
			.addOutput(outputDirPath+type+id+"/frame_%05d.png")
			.setVideoFrameRate(30, 1) // 1초에 30프레임 추출
			.done();

		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();
		// 파일 갯수 세기
		File[] fileList = new File(outputDirPath+type+id).listFiles();
		int size = fileList.length;

		// ai 서버로 전송
		try (Stream<Path> paths = Files.walk(Path.of(outputDirPath+type+id))) {
			paths.filter(Files::isRegularFile)
				.forEach(path -> {
					try {
						aiServerService.publish(
							MessageRequest.builder()
								.type(type)
								.id(id)
								.name(String.valueOf(path.getFileName()))
								.image(Files.readAllBytes(path))
								.size(size)
								.build(),
							type
						);
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				});
		} catch(IOException e) {
			e.printStackTrace();
		}
		log.info("============== Sending " + type + " Vod Done ==============");
		log.info(type + " id: " + id + ", frame amount: " + size);

		MultipartFile ret = FileUtil.convertToMultipartFile(
			new File(outputDirPath + type + id + "/frame_00090.png"));

		// 이미지파일 삭제
		Files.walk(Path.of(outputDirPath + type + id))
			.map(Path::toFile)
			.forEach(File::delete);
		Files.delete(Path.of(outputDirPath + type + id));

		return ret;
	}
	/**
	 *
	 * @param id
	 * @param video
	 * @return 멀티파트 이미지 파일. 썸네일로 사용
	 * @throws IOException
	 */
	public MultipartFile sendVodToKafkaFeedback(long id, MultipartFile video) throws IOException {
		String type = "feedback";
		Path tempFilePath = Files.createTempFile("temp-", ".mp4");
		video.transferTo(tempFilePath);

		Files.createDirectories(Path.of(outputDirPath + type + id));

		// 동영상 파일 -> 0.5초마다의 프레임 이미지
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(tempFilePath.toString())
			.addOutput(outputDirPath+type+id+"/frame_%04d.png")
			.setVideoFrameRate(2, 1) // 1초에 2프레임 추출
			.done();

		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();
		// 파일 갯수 세기
		File[] fileList = new File(outputDirPath+type+id).listFiles();
		int size = fileList.length;

		// ai 서버로 전송
		try (Stream<Path> paths = Files.walk(Path.of(outputDirPath+type+id))) {
			paths.filter(Files::isRegularFile)
				.forEach(path -> {
					try {
						aiServerService.publish(
							MessageRequest.builder()
								.type(type)
								.id(id)
								.name(String.valueOf(path.getFileName()))
								.image(Files.readAllBytes(path))
								.size(size)
								.build(),
							type
						);
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				});
		} catch(IOException e) {
			e.printStackTrace();
		}
		log.info("============== Sending " + type + " Vod Done ==============");
		log.info(type + " id: " + id + ", frame amount: " + size);

		MultipartFile ret = FileUtil.convertToMultipartFile(
			new File(outputDirPath + type + id + "/frame_0008.png"));

		// 이미지파일 삭제
		Files.walk(Path.of(outputDirPath + type + id))
			.map(Path::toFile)
			.forEach(File::delete);
		Files.delete(Path.of(outputDirPath + type + id));
		// 영상파일 삭제
		Files.delete(tempFilePath);

		return ret;

	}
}
