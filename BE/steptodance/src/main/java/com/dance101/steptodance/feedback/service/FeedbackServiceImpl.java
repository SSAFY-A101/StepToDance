package com.dance101.steptodance.feedback.service;

import com.dance101.steptodance.feedback.data.response.FeedbackFindResponse;
import com.dance101.steptodance.feedback.data.response.FeedbackInfoResponse;
import com.dance101.steptodance.feedback.data.response.SectionListResponse;
import com.dance101.steptodance.feedback.domain.Feedback;
import com.dance101.steptodance.feedback.domain.Timestamp;
import com.dance101.steptodance.feedback.repository.FeedbackBodyRepository;
import com.dance101.steptodance.feedback.repository.FeedbackRepository;
import com.dance101.steptodance.feedback.repository.TimeStampRepository;
import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.guide.data.response.GuideFeedbackCreateResponse;
import com.dance101.steptodance.infra.S3Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.FEEDBACK_NOT_FOUND;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackBodyRepository feedbackBodyRepository;
    private final TimeStampRepository timeStampRepository;
    private final S3Service s3Service;

    @Override
    public FeedbackFindResponse findFeedback(long feedbackId) {
        // get feedback info
        FeedbackInfoResponse feedbackInfoResponse = feedbackRepository.findFeedbackByFeedbackId(feedbackId)
            .orElseThrow(() -> new NotFoundException("FeedbackServiceImpl:findFeedback", FEEDBACK_NOT_FOUND));

        // get incorrect sections
        List<SectionListResponse> sectionListResponses = feedbackRepository.findSectionListByFeedbackId(feedbackId);

        // create & return response
        return FeedbackFindResponse.builder()
            .feedbackInfoResponse(feedbackInfoResponse)
            .sectionListResponses(sectionListResponses)
            .build();
    }

    @Transactional
    @Override
    public void deleteFeedback(long feedbackId) {
        // MySql
        // get feedback
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new NotFoundException("FeedbackServiceImpl:deleteFeedback", FEEDBACK_NOT_FOUND));
        // delete
        feedbackRepository.delete(feedback);
        // s3
        s3Service.delete("feedback/"+feedbackId+ ".mp4");
        // MongoDB
        feedbackBodyRepository.deleteByFeedbackId(feedbackId);
    }

    @Transactional
    @Override
    public void updateFeedback(GuideFeedbackCreateResponse guideFeedbackCreateResponse) {
        // get feedback
        Feedback feedback = feedbackRepository.findById(guideFeedbackCreateResponse.id())
            .orElseThrow(() -> new NotFoundException("FeedbackServiceImpl:updateFeedback", FEEDBACK_NOT_FOUND));

        // update & save feedback
        feedback.update(guideFeedbackCreateResponse.score());

        // create incorrect sections
        List<Timestamp> timestamps = new ArrayList<>();
        guideFeedbackCreateResponse.sectionListResponses().forEach(section -> {
            Timestamp timestamp = Timestamp.builder().startAt(section).feedback(feedback).build();
            timestamps.add(timestamp);
        });

        // save incorrect sections
        timeStampRepository.saveAll(timestamps);
    }
}
