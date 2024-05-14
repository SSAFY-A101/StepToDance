package com.dance101.steptodance.global.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

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

		// 동영상 파일 -> 0.5초마다의 프레임 이미지
		FFmpegBuilder builder = new FFmpegBuilder()
			.setInput(vodPath.toString())
			.addOutput(outputDirPath+type+id+"/frame_%05d.png")
			.setVideoFrameRate(30, 1) // 1초에 2프레임 추출
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
		// 영상파일 삭제
		Files.delete(vodPath);

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
