package com.dance101.steptodance.shortform.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dance101.steptodance.shortform.data.request.ShortformUploadMultipartRequest;
import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;

public interface ShortformService {
	void shortformUploadFile(long userId, ShortformUploadMultipartRequest request);

	ShortformFindResponse findShortform(long shortformId);

	Page<ShortformFindResponse> findShortformList(Pageable pageable);

	void deleteShortForm(long shortformId);
}
