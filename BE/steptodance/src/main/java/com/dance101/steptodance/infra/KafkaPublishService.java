package com.dance101.steptodance.infra;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;

import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.global.exception.category.ForbiddenException;
import com.dance101.steptodance.guide.data.request.MessageRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaPublishService implements AIPublishService {
    private final KafkaTemplate<String, String> kafkaTemplate;
    @Value(value = "${message.topic.feedback.name}")
    private String feedbackTopicName;
    @Value(value = "${message.topic.guide.name}")
    private String guideTopicName;
    @Autowired
    private final ObjectMapper objectMapper;

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


}
