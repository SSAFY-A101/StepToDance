package com.dance101.steptodance.infra;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dance101.steptodance.feedback.domain.Feedback;
import com.dance101.steptodance.feedback.domain.FeedbackBodyModel;
import com.dance101.steptodance.feedback.repository.FeedbackBodyRepository;
import com.dance101.steptodance.feedback.repository.FeedbackRepository;
import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.global.exception.data.response.ErrorCode;
import com.dance101.steptodance.global.utils.FFmpegUtils;
import com.dance101.steptodance.global.utils.FileUtil;
import com.dance101.steptodance.global.utils.grader.MoveNetGraderEuclideanDistanceUtils;
import com.dance101.steptodance.guide.data.request.Frame;
import com.dance101.steptodance.guide.data.response.GuideFeedbackCreateResponse;
import com.dance101.steptodance.guide.domain.Guide;
import com.dance101.steptodance.guide.domain.GuideBodyModel;
import com.dance101.steptodance.guide.repository.GuideBodyRepository;
import com.dance101.steptodance.guide.repository.GuideRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaConsumeService implements AIConsumeService {
	private final GuideRepository guideRepository;
	private final FeedbackRepository feedbackRepository;
	private final GuideBodyRepository guideBodyRepository;
	private final FeedbackBodyRepository feedbackBodyRepository;
	private final FFmpegUtils ffmpegUtils;
	// private final CaffeGraderUtils graderUtils;
	// private final MoveNetGraderUtils graderUtils;
	private final MoveNetGraderEuclideanDistanceUtils graderUtils;
	private final S3Service s3Service;
	@Autowired
	private final ObjectMapper objectMapper;
	private final StringRedisTemplate redisTemplate;
	private final List<Integer> zeroList = List.of(0, 0);
	private final List<Double> zeroDoubleList = List.of(0.0, 0.0);

	@KafkaListener(topics = "${message.topic.name}", groupId = "step-to-dance")
	public void consume(String message) throws JsonProcessingException {
		// convert message to DTO
		GuideFeedbackCreateResponse response = objectMapper.readValue(message, GuideFeedbackCreateResponse.class);

		// update & save result
		// feedbackService.updateFeedback(response);
	}

	@Transactional
	@KafkaListener(topics = "${message.topic.guide.completion-name}", groupId = "step-to-dance")
	public void consumeGuideCompletion(String message) {
		log.info("consumeGuideCompletion: received message = " + message);
		// call guide model & save to MongoDB
		List<String> list = redisTemplate.opsForList().range("guide:"+message, 0, -1);
		log.info("consumeGuideCompletion: redis list called.");
		log.info("consumeGuideCompletion: size= " + list.size());
		log.info("consumeGuideCompletion: an Item = " + list.get(0));

		List<Frame<Double>> frameList = getFrameListFromString(list);
		log.info("consumeGuideCompletion: json mapped to object");

		frameList.sort((item1, item2) -> item1.getName().compareTo(item2.getName()));
		log.info("consumeGuideCompletion: objects has been sorted");

		frameList = fillEmptyFrames(frameList);
		log.info("consumeGuideCompletion: filled all empty frames");

		// s3 기존의 영상을 잘라서 다시 저장
		try {
			Path oldGuide = s3Service.download("guide/"+message+".mp4");
			Path newGuide = ffmpegUtils.setVodCenterOnHuman(oldGuide, Long.parseLong(message), frameList);
			s3Service.delete("guide/"+message+".mp4");
			// TODO: 새로운 로컬 영상 삭제하기
			String url = s3Service.upload(FileUtil.convertToMultipartFile(newGuide.toFile()), "guide/"+message+".mp4");
			log.info("consumeGuideCompletion: guide video file has been replaced");
			log.info("consumeGuideCompletion: " + url);
			newGuide.toFile().delete();
			guideRepository.findById(Long.parseLong(message))
				.orElseThrow(() -> new NotFoundException("consumeGuideCompletion::가이드를 찾을 수 없습니다.", GUIDE_NOT_FOUND))
				.addUrl(url);
		} catch (IOException e) {
			e.printStackTrace();
			throw new ExternalServerException("consumeGuideCompletion: exception occured during editing s3 vod ", S3_VOD_EDIT_FAILED);
		}

		// update & save result
		GuideBodyModel<Double> model = makeGuideModelOutOfFrameList(message, frameList);
		guideBodyRepository.save(model);
		log.info("consumeGuideCompletion: stored in MongoDB");

		// 레디스에 저장된 내용을 지운다.
		redisTemplate.delete("guide:" + message);
	}

	@Transactional
	@KafkaListener(topics = "${message.topic.feedback.completion-name}", groupId = "step-to-dance")
	public void consumeFeedbackCompletion(String message) {
		log.info("consumeFeedbackCompletion: received message = " + message);
		// call guide model & save to MongoDB
		List<String> list = redisTemplate.opsForList().range("feedback:"+message, 0, -1);
		log.info("consumeFeedbackCompletion: redis list called.");
		log.info("consumeFeedbackCompletion: size= " + list.size());
		log.info("consumeFeedbackCompletion: an Item = " + list.get(0));

		List<Frame<Double>> frameList = getFrameListFromString(list);
		log.info("consumeFeedbackCompletion: json mapped to object");

		frameList.sort((item1, item2) -> item1.getName().compareTo(item2.getName()));
		log.info("consumeFeedbackCompletion: objects has been sorted");

		frameList = fillEmptyFrames(frameList);
		log.info("consumeFeedbackCompletion: filled all empty frames");

		// update & save result
		FeedbackBodyModel<Double> model = makeFeedbackModelOutOfFrameList(message, frameList);
		feedbackBodyRepository.save(model);
		log.info("consumeFeedbackCompletion: stored in MongoDB");

		// 레디스에 저장된 내용을 지운다.
		redisTemplate.delete("feedback:" + message);

		// RATE 'EM!!!
		// 피드백 가져오기
		Feedback feedback = feedbackRepository.findById(Long.parseLong(message))
			.orElseThrow(() -> new NotFoundException("consumeFeedbackCompletion:저장된 피드백이 없습니다.", FEEDBACK_NOT_FOUND));
		// 가이드 아이디 가져오기
		Guide guide = feedback.getGuide();
		// 가이드 아이디로 모델 가져오기
		GuideBodyModel<Double> guideBodyModel = guideBodyRepository.findByGuideId(guide.getId())
			.orElseThrow(() -> new NotFoundException("consumeFeedbackCompletion:저장된 가이드 모델이 없습니다.", GUIDE_BODY_NOT_FOUND));
		// 모델 비교하기
		double score = graderUtils.getScore(0, model.getModels().size(),
			guideBodyModel.getModels(), model.getModels());
		// 점수를 피드백으로 업데이트하기
		feedback.update(score);
	}

	private GuideBodyModel<Double> makeGuideModelOutOfFrameList(String message, List<Frame<Double>> frameList) {
		return GuideBodyModel.<Double>builder()
			.guideId(Long.parseLong(message))
			.models(
				frameList.stream()
					.map(Frame::getModel)
					.collect(Collectors.toList())
			)
			.build();
	}

	private FeedbackBodyModel<Double> makeFeedbackModelOutOfFrameList(String message, List<Frame<Double>> frameList) {
		return FeedbackBodyModel.<Double>builder()
			.feedbackId(Long.parseLong(message))
			.models(
				frameList.stream()
					.map(Frame::getModel)
					.collect(Collectors.toList())
			)
			.build();
	}

	private List<Frame<Double>> getFrameListFromString(List<String> list) {
		return new ArrayList<>(list.parallelStream().map(item -> {
			try {
				return objectMapper.readValue(item, new TypeReference<Frame<Double>>() {});
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		}).toList());
	}

	private List<Frame<Double>> fillEmptyFrames(List<Frame<Double>> frameList) {
		// 첫 프레임 채우기
		Frame<Double> frame = frameList.get(0);
		for (int i = 0; i < frame.getModel().size(); i++) {
			if (frame.getModel().get(i) == null) {
				dfsBothEnd(i, 0, '+', frameList);
				log.info(frame.getModel().toString());
			}
		}
		log.info("fillEmptyFrames: start point filled");

		// 마지막 프레임 채우기
		frame = frameList.get(frameList.size()-1);
		for (int i = 0; i < frame.getModel().size(); i++) {
			if (frame.getModel().get(i) == null) {
				dfsBothEnd(i, frameList.size() - 1, '-', frameList);
				log.info(frame.getModel().toString());
			}
		}
		log.info("fillEmptyFrames: end point filled");

		// 중간 프레임 채우기
		for (int i = 1; i < frameList.size() - 1; i++) {
			frame = frameList.get(i);
			for (int j = 0; j < frame.getModel().size(); j++) {
				fillFrame(j, i, frameList);
			}
		}
		log.info("fillEmptyFrames: middle empty points filled");
		return frameList;
	}

	private void fillFrame(int joint, int frameIndex, List<Frame<Double>> frameList) {
		int startFrameIndex = frameIndex - 1;
		int endFrameIndex = frameIndex;
		while (frameList.get(endFrameIndex).getModel().get(joint) == null) {
			endFrameIndex++;
		}
		// 끝날때 까지 비어있다면
		if (endFrameIndex == frameList.size()) {
			for (int i = frameIndex; i < endFrameIndex; i++) {
				frameList.get(i).getModel().set(joint, zeroDoubleList);
			}
			return;
		}
		double diffY = frameList.get(endFrameIndex).getModel().get(joint).get(0)
			- frameList.get(startFrameIndex).getModel().get(joint).get(0);
		diffY /= endFrameIndex - startFrameIndex;
		double diffX = frameList.get(endFrameIndex).getModel().get(joint).get(1)
			- frameList.get(startFrameIndex).getModel().get(joint).get(1);
		diffX /= endFrameIndex - startFrameIndex;

		List<Double> last = frameList.get(startFrameIndex).getModel().get(joint);
		List<Double> curr;
		startFrameIndex++;
		for (int i = startFrameIndex; i < endFrameIndex; i++) {
			curr = List.of(last.get(0)+diffY, last.get(1)+diffX);
			frameList.get(i).getModel().set(joint, curr);
			last = curr;
		}
	}

	private List<Double> dfsBothEnd(int joint, int frameIndex, char cmd, List<Frame<Double>> frameList) {
		if (frameIndex >= frameList.size() || frameIndex < 0) return zeroDoubleList;
		// List<Integer> thisFrame = frameList.get(frameIndex).getModel().get(joint);
		List<Double> thisFrame = frameList.get(frameIndex).getModel().get(joint);
		if (thisFrame != null) {
			return thisFrame;
		} else {
			if (cmd == '+') {
				thisFrame = dfsBothEnd(joint, frameIndex + 1, cmd, frameList); // 값 설정
				frameList.get(frameIndex).getModel().set(joint, thisFrame); // 값 설정
				log.info("joint, frameindex=" + joint + " " + frameIndex + "\t" + thisFrame.toString());
				return thisFrame; // 값 반환
			} else {
				thisFrame = dfsBothEnd(joint, frameIndex - 1, cmd, frameList); // 값 설정
				frameList.get(frameIndex).getModel().set(joint, thisFrame); // 값 설정
				log.info("joint, frameindex=" + joint + " " + frameIndex + "\t" + thisFrame.toString());
				return thisFrame; // 값 반환
			}
		}
	}
}
