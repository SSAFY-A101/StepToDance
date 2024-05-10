package com.dance101.steptodance.guide.service;

import com.dance101.steptodance.feedback.data.response.FeedbackFindResponse;
import com.dance101.steptodance.guide.data.request.GuideFeedbackCreateRequest;
import com.dance101.steptodance.guide.data.request.GuideUploadMultipartRequest;
import com.dance101.steptodance.guide.data.request.GuideUploadRequest;
import com.dance101.steptodance.guide.data.request.SearchConditions;
import com.dance101.steptodance.guide.data.response.FeedbackResponse;
import com.dance101.steptodance.guide.data.response.GuideFindResponse;
import com.dance101.steptodance.guide.data.response.GuideListFindResponse;

import java.util.concurrent.CompletableFuture;

import org.springframework.web.multipart.MultipartFile;

public interface GuideService {
	GuideListFindResponse findGuideList(SearchConditions searchConditions, long userId);

	GuideListFindResponse findHotGuideList();

	void guideUpload(GuideUploadRequest guideUploadRequest);

	void guideUploadFile(long userId, GuideUploadMultipartRequest request);

	GuideFindResponse findGuide(long guideId);

	CompletableFuture<FeedbackResponse> createGuideFeedback(long userId, long guideId, GuideFeedbackCreateRequest guideFeedbackCreateRequest);
}
