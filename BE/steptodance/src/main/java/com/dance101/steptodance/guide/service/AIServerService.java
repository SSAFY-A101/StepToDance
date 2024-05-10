package com.dance101.steptodance.guide.service;

import com.dance101.steptodance.guide.data.request.FeedbackMessageRequest;
import com.dance101.steptodance.guide.data.request.MessageRequest;

public interface AIServerService {
    void publish(MessageRequest feedbackMessageRequest, String type);

    void publish(FeedbackMessageRequest feedbackMessageRequest);
}
