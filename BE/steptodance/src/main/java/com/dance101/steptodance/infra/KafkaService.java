package com.dance101.steptodance.infra;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.dance101.steptodance.feedback.service.FeedbackService;
import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.guide.data.request.FeedbackMessageRequest;
import com.dance101.steptodance.guide.data.request.GuideFrame;
import com.dance101.steptodance.guide.data.request.GuideMessageRequest;
import com.dance101.steptodance.guide.data.response.GuideFeedbackCreateResponse;
import com.dance101.steptodance.guide.domain.GuideBodyModel;
import com.dance101.steptodance.guide.repository.GuideBodyRepository;
import com.dance101.steptodance.guide.repository.GuideRepository;
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
    public void publish(GuideMessageRequest guideMessageRequest) {
        // send message
        log.info("KafkaService::publish : ===========" + guideMessageRequest.name() + " send ===========");
        try {
            this.kafkaTemplate.send(guideTopicName, objectMapper.writeValueAsString(guideMessageRequest));
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
    public void consumeGuideCompletion(String message) throws JsonProcessingException {
        log.info("KafkaService::consumeGuideCompletion: received message = " + message);
        // call guide model & save to MongoDB
        List<String> list = redisTemplate.opsForList().range("guide:"+message, 0, -1);
        log.info("KafkaService::consumeGuideCompletion: redis list called.");
        log.info("KafkaService::consumeGuideCompletion: size= " + list.size());
        log.info("KafkaService::consumeGuideCompletion: an Item = " + list.get(0));

        List<GuideFrame> frameList = new ArrayList<>(list.parallelStream().map(item -> {
            try {
                return objectMapper.readValue(item, GuideFrame.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).toList());
        log.info("KafkaService::consumeGuideCompletion: json mapped to object");

        frameList.sort((item1, item2) -> item1.getName().compareTo(item2.getName()));
        log.info("KafkaService::consumeGuideCompletion: objects has been sorted");
        // 첫 프레임 채우기
        GuideFrame frame = frameList.get(0);
        for (int i = 0; i < frame.getModel().size(); i++) {
            if (frame.getModel().get(i) == null) {
                dfsBothEnd(i, 1, '+', frameList);
            }
        }

        // 마지막 프레임 채우기
        frame = frameList.get(frameList.size()-1);
        for (int i = 0; i < frame.getModel().size(); i++) {
            if (frame.getModel().get(i) == null) {
                dfsBothEnd(i, frameList.size() - 2, '-', frameList);
            }
        }

        // 중간 프레임 채우기
        for (int i = 1; i < frameList.size() - 1; i++) {
            for (int j = 0; j < frame.getModel().size(); j++) {
                fillFrame(j, i, frameList);
            }
        }

        // update & save result
        GuideBodyModel model = GuideBodyModel.builder()
            .guideId(Long.parseLong(message))
            .models(
                frameList.stream()
                    .map(GuideFrame::getModel)
                    .collect(Collectors.toList())
            )
            .build();

        guideBodyRepository.save(model);
        log.info("KafkaService::consumeGuideCompletion: stored in MongoDB");

        // TODO: 레디스에 저장된 내용을 지운다.
        // redisTemplate.delete("guide:" + message);
    }

    private void fillFrame(int joint, int frameIndex, List<GuideFrame> frameList) {
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

    private List<Integer> dfsBothEnd(int i, int depth, char cmd, List<GuideFrame> frameList) {
        if (depth >= frameList.size() || depth < 0) return zeroList;
        List<Integer> thisFrame = frameList.get(depth).getModel().get(i);
        if (thisFrame != null) {
            return thisFrame;
        }
        else {
            if (cmd == '+') {
                frameList.get(depth).getModel().set(i, dfsBothEnd(i, depth + 1, cmd, frameList));
                return thisFrame;
            }
            else {
                frameList.get(depth).getModel().set(i, dfsBothEnd(i, depth - 1, cmd, frameList));
                return thisFrame;
            }
        }
    }
}
