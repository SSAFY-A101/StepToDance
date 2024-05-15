package com.dance101.steptodance.infra;

import com.dance101.steptodance.guide.data.request.MessageRequest;

public interface AIPublishService {
    void publish(MessageRequest feedbackMessageRequest, String type);
}
