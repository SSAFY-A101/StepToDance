package com.dance101.steptodance.guide.controller;

import com.dance101.steptodance.auth.utils.SecurityUser;
import com.dance101.steptodance.global.data.response.ApiResponse;
import com.dance101.steptodance.guide.data.request.GuideFeedbackCreateRequest;
import com.dance101.steptodance.guide.data.request.GuideUploadMultipartRequest;
import com.dance101.steptodance.guide.data.request.GuideUploadRequest;
import com.dance101.steptodance.guide.data.request.SearchConditions;
import com.dance101.steptodance.guide.data.response.FeedbackResponse;
import com.dance101.steptodance.guide.data.response.GuideFindResponse;
import com.dance101.steptodance.guide.data.response.GuideListFindResponse;
import com.dance101.steptodance.guide.service.GuideService;
import lombok.RequiredArgsConstructor;

import org.hibernate.annotations.Parameter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static com.dance101.steptodance.global.data.response.StatusCode.*;
import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RequestMapping("/guides")
@RestController
public class GuideController {
	private final GuideService guideService;
	@GetMapping
	public ResponseEntity<ApiResponse<GuideListFindResponse>> findGuideList(
		@AuthenticationPrincipal SecurityUser securityUser,
		@ModelAttribute SearchConditions searchConditions) {
		long userId = securityUser.getId();
		GuideListFindResponse response = guideService.findGuideList(searchConditions, userId);
		return ApiResponse.toResponse(OK, SUCCESS_GUIDE_LIST, response);
	}

	@GetMapping("/hot-guide")
	public ResponseEntity<ApiResponse<GuideListFindResponse>> findHotGuideList() {
		GuideListFindResponse response = guideService.findHotGuideList();
		return ApiResponse.toResponse(OK, SUCCESS_GUIDE_LIST, response);
	}

	// TODO: 경로 매핑이 문제없이 되는 지 확인 필요
	@PostMapping(value = "/file", consumes = "multipart/form-data")
	public ResponseEntity<ApiResponse<Void>> uploadGuideFile(
		@AuthenticationPrincipal SecurityUser securityUser,
		@ModelAttribute GuideUploadMultipartRequest request
	) {
		guideService.guideUploadFile(securityUser.getId(), request);
		return ApiResponse.toEmptyResponse(CREATED, CREATED_GUIDE);
	}


	@GetMapping("/{guide_id}")
	public ResponseEntity<ApiResponse<GuideFindResponse>> findGuide(@PathVariable("guide_id") long guideId) {
		GuideFindResponse response = guideService.findGuide(guideId);
		return ApiResponse.toResponse(OK, SUCCESS_GUIDE_ONE, response);
	}

	@DeleteMapping("/{guide_id}")
	public ResponseEntity<ApiResponse<Void>> deleteGuide(@PathVariable("guide_id") long guideId) {
		guideService.deleteGuide(guideId);
		return ApiResponse.toEmptyResponse(NO_CONTENT, SUCCESS_GUIDE_DELETION);
	}

	@PostMapping(value = "/{guide_id}", consumes = "multipart/form-data")
	public ResponseEntity<ApiResponse<FeedbackResponse>> createGuideFeedback(
		@AuthenticationPrincipal SecurityUser securityUser,
		@PathVariable("guide_id") long guideId,
		@ModelAttribute GuideFeedbackCreateRequest guideFeedbackCreateRequest
	) throws ExecutionException, InterruptedException {
		long userId = securityUser.getId();
		FeedbackResponse response = guideService.createGuideFeedback(userId, guideId, guideFeedbackCreateRequest);
		return ApiResponse.toResponse(CREATED, SUCCESS_FEEDBACK_CREATION, response);
	}

}
