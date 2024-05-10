package com.dance101.steptodance.infra;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.dance101.steptodance.feedback.domain.FeedbackBodyModel;
import com.dance101.steptodance.feedback.repository.FeedbackBodyRepository;
import com.dance101.steptodance.feedback.service.FeedbackService;
import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.global.exception.category.ForbiddenException;
import com.dance101.steptodance.guide.data.request.FeedbackMessageRequest;
import com.dance101.steptodance.guide.data.request.Frame;
import com.dance101.steptodance.guide.data.request.MessageRequest;
import com.dance101.steptodance.guide.data.response.GuideFeedbackCreateResponse;
import com.dance101.steptodance.guide.domain.GuideBodyModel;
import com.dance101.steptodance.guide.repository.GuideBodyRepository;
import com.dance101.steptodance.guide.service.AIServerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaService implements AIServerService {
    private final FeedbackService feedbackService;
    private final GuideBodyRepository guideBodyRepository;
    private final FeedbackBodyRepository feedbackBodyRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    @Value(value = "${message.topic.feedback.name}")
    private String feedbackTopicName;
    @Value(value = "${message.topic.guide.name}")
    private String guideTopicName;
    @Autowired
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;
    private final List<Integer> zeroList = List.of(0, 0);

    @Override
    public void publish(MessageRequest messageRequest, String type) {
        String topicName = switch (type) {
            case "guide" -> guideTopicName;
            case "feedback" -> feedbackTopicName;
			default -> throw new ForbiddenException("Unexpected topic: " + type, KAFKA_INVALID_TOPIC);
		};

        // send message
        log.info("KafkaService::publish : ===========" + messageRequest.name() + " send ===========");
        try {
            this.kafkaTemplate.send(topicName, objectMapper.writeValueAsString(messageRequest));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new ExternalServerException("KafkaService::publish : "+"json parsing problem", JSON_PARSE_CAN_NOT_BE_DONE);
        }
    }

    @Override
    public void publish(FeedbackMessageRequest feedbackMessageRequest) {
        // send message
        this.kafkaTemplate.send(feedbackTopicName, feedbackMessageRequest.toString());
    }

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

        List<Frame> frameList = getFrameListFromString(list);
        log.info("consumeGuideCompletion: json mapped to object");

        frameList.sort((item1, item2) -> item1.getName().compareTo(item2.getName()));
        log.info("consumeGuideCompletion: objects has been sorted");

        frameList = fillEmptyFrames(frameList);
        log.info("consumeGuideCompletion: filled all empty frames");

        // update & save result
        GuideBodyModel model = makeGuideModelOutOfFrameList(message, frameList);
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

        List<Frame> frameList = getFrameListFromString(list);
        log.info("consumeFeedbackCompletion: json mapped to object");

        frameList.sort((item1, item2) -> item1.getName().compareTo(item2.getName()));
        log.info("consumeFeedbackCompletion: objects has been sorted");

        frameList = fillEmptyFrames(frameList);
        log.info("consumeFeedbackCompletion: filled all empty frames");

        // update & save result
        FeedbackBodyModel model = makeFeedbackModelOutOfFrameList(message, frameList);
        feedbackBodyRepository.save(model);
        log.info("consumeFeedbackCompletion: stored in MongoDB");

        // 레디스에 저장된 내용을 지운다.
        redisTemplate.delete("feedback:" + message);
    }

    private GuideBodyModel makeGuideModelOutOfFrameList(String message, List<Frame> frameList) {
        return GuideBodyModel.builder()
            .guideId(Long.parseLong(message))
            .models(
                frameList.stream()
                    .map(Frame::getModel)
                    .collect(Collectors.toList())
            )
            .build();
    }

    private FeedbackBodyModel makeFeedbackModelOutOfFrameList(String message, List<Frame> frameList) {
        return FeedbackBodyModel.builder()
            .feedbackId(Long.parseLong(message))
            .models(
                frameList.stream()
                    .map(Frame::getModel)
                    .collect(Collectors.toList())
            )
            .build();
    }

    private List<Frame> getFrameListFromString(List<String> list) {
        return new ArrayList<>(list.parallelStream().map(item -> {
            try {
                return objectMapper.readValue(item, Frame.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).toList());
    }

    private List<Frame> fillEmptyFrames(List<Frame> frameList) {
        // 첫 프레임 채우기
        Frame frame = frameList.get(0);
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

    private void fillFrame(int joint, int frameIndex, List<Frame> frameList) {
        int startFrameIndex = frameIndex - 1;
        int endFrameIndex = frameIndex;
        while (frameList.get(endFrameIndex).getModel().get(joint) == null) {
            endFrameIndex++;
        }
        // 끝날때 까지 비어있다면
        if (endFrameIndex == frameList.size()) {
            for (int i = frameIndex; i < endFrameIndex; i++) {
                frameList.get(i).getModel().set(joint, zeroList);
            }
            return;
        }
        int diffY = frameList.get(endFrameIndex).getModel().get(joint).get(0)
            - frameList.get(startFrameIndex).getModel().get(joint).get(0);
        diffY /= endFrameIndex - startFrameIndex;
        int diffX = frameList.get(endFrameIndex).getModel().get(joint).get(1)
            - frameList.get(startFrameIndex).getModel().get(joint).get(1);
        diffX /= endFrameIndex - startFrameIndex;

        List<Integer> last = frameList.get(startFrameIndex).getModel().get(joint);
        List<Integer> curr;
        startFrameIndex++;
        for (int i = startFrameIndex; i < endFrameIndex; i++) {
            curr = List.of(last.get(0)+diffY, last.get(1)+diffX);
            frameList.get(i).getModel().set(joint, curr);
            last = curr;
        }
    }

    private List<Integer> dfsBothEnd(int joint, int frameIndex, char cmd, List<Frame> frameList) {
        if (frameIndex >= frameList.size() || frameIndex < 0) return zeroList;
        List<Integer> thisFrame = frameList.get(frameIndex).getModel().get(joint);
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
