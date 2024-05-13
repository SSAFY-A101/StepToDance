package com.dance101.steptodance.shortform.controller;

import static com.dance101.steptodance.global.data.response.StatusCode.*;
import static org.springframework.http.HttpStatus.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.dance101.steptodance.auth.utils.SecurityUser;
import com.dance101.steptodance.global.data.response.ApiResponse;
import com.dance101.steptodance.global.data.response.StatusCode;
import com.dance101.steptodance.shortform.data.request.ShortformUploadMultipartRequest;
import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;
import com.dance101.steptodance.shortform.service.ShortformService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/shorts")
@RestController
public class ShortformController {
	private final ShortformService shortformService;

	@GetMapping
	public ResponseEntity<ApiResponse<Page<ShortformFindResponse>>> findShortformList(
		@PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		Page<ShortformFindResponse> response = shortformService.findShortformList(pageable);
		return ApiResponse.toResponse(OK, StatusCode.SUCCESS_SHORTS_LIST, response);
	}

	@GetMapping("/{shortform_id}")
	public ResponseEntity<ApiResponse<ShortformFindResponse>> findShortform(@PathVariable("shortform_id") long shortformId){
		ShortformFindResponse response = shortformService.findShortform(shortformId);
		return ApiResponse.toResponse(OK, StatusCode.SUCCESS_SHORTS_ONE, response);
	}

	@PostMapping(value="/file", consumes = "multipart/form-data")
	public ResponseEntity<ApiResponse<Long>> uploadShortform(
		// @AuthenticationPrincipal SecurityUser securityUser,
		@ModelAttribute ShortformUploadMultipartRequest request
	){
		// Long response = shortformService.shortformUploadFile(securityUser, request);
		Long response = shortformService.shortformUploadFile(2L, request);
		return ApiResponse.toResponse(CREATED, SUCCESS_SHORTS_CREATION, response);
	}

	@DeleteMapping("/{shortform_id}")
	public ResponseEntity<ApiResponse<Void>> deleteShortform(@PathVariable("shortform_id") long shortformId){
		shortformService.deleteShortForm(shortformId);
		return ApiResponse.toEmptyResponse(NO_CONTENT, StatusCode.SUCCESS_SHORTS_DELETION);
	}
}
