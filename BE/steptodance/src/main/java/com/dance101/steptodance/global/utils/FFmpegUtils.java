package com.dance101.steptodance.global.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.nio.file.Paths;
import java.time.LocalTime;
import java.util.concurrent.TimeUnit;
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
import com.dance101.steptodance.infra.KafkaPublishService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FFmpegUtils {
	private final String ffmpegPath;
	private final String ffprobePath;
	private FFmpeg ffmpeg;
	private FFprobe ffprobe;
	private final String outputDirPath = "data/vod/output";
	private final KafkaPublishService kafkaPublishService;

	public FFmpegUtils(
		@Value("${ffmpeg.location}")String ffmpegPath,
		@Value("${ffprobe.location}")String ffprobePath,
		KafkaPublishService kafkaPublishService) throws IOException
	{
		this.ffmpegPath = ffmpegPath;
		this.ffprobePath = ffprobePath;
		this.kafkaPublishService = kafkaPublishService;
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
		Files.createDirectories(Path.of(outputDirPath + "guide" + id));
		Files.createDirectories(Path.of(outputDirPath + "guide" + id + "/output"));
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(path.toString())
			.addOutput(outputDirPath+"guide"+id+"/frame_%05d.png")
			.setVideoFrameRate(30, 1) // 1초에 30프레임 추출
			.done();

		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();
		log.info("setVodCenterOnHuman: vod to img success");

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
		log.info("setVodCenterOnHuman: width=" + width + ", height=" + height);

		for (int i = 1; i <= frameList.size(); i++) {
			// movenet 모델
			double x = 0;
			for (List<Double> joint : frameList.get(i).getModel()) {
				x += joint.get(0);
			}
			x /= 17;
			x = width * x;
			builder = new FFmpegBuilder();
			builder.setInput(outputDirPath + "guide" + id + String.format("/frame_%05d.png", i));
			builder.addOutput(outputDirPath + "guide" + id + "/output" + String.format("/frame_%05d.png", i));
			builder.setVideoFilter("crop="+ width +":in_h:" + Math.max(0, (int)x - halfWidth) + ":0");
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
						kafkaPublishService.publish(
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
						kafkaPublishService.publish(
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

	public MultipartFile editVideo(MultipartFile video, LocalTime startAt, LocalTime endAt) throws IOException {
		// 임시 파일 생성
		Path tempFilePath = Files.createTempFile("temp-", ".mp4");
		video.transferTo(tempFilePath);

		// 출력 파일 경로 설정
		String outputFilePath = tempFilePath.getParent().toString() + File.separator + "edited_video.mp4";

		// 시작 시간과 종료 시간을 밀리초로 변환
		long startMilliseconds = toMilliseconds(startAt);
		long durationMilliseconds = toMilliseconds(endAt) - startMilliseconds;

		// FFmpegBuilder를 사용하여 비디오 편집 작업 설정
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(tempFilePath.toString())
			.overrideOutputFiles(true) // 출력 파일 덮어쓰기
			.addOutput(outputFilePath)
			.setStartOffset(startMilliseconds, TimeUnit.MILLISECONDS) // 시작 시간 설정 (밀리초 단위)
			.setDuration(durationMilliseconds, TimeUnit.MILLISECONDS) // 지속 시간 설정 (밀리초 단위)
			.done();

		// FFmpegExecutor를 사용하여 비디오 편집 작업 실행
		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();

		// 편집된 비디오 파일을 MultipartFile로 변환하여 반환
		File editedVideoFile = new File(outputFilePath);
		MultipartFile editedVideo = FileUtil.convertToMultipartFile(editedVideoFile);

		// 임시 파일 및 편집된 비디오 파일 삭제
		Files.delete(tempFilePath);
		Files.deleteIfExists(Paths.get(outputFilePath));

		return editedVideo;
	}

	private long toMilliseconds(LocalTime time) {
		return time.toNanoOfDay() / 1_000_000;
	}

}
