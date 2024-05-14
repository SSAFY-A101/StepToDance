package com.dance101.steptodance.shortform.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dance101.steptodance.shortform.data.request.ShortformUploadMultipartRequest;
import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;

public interface ShortformService {
	Long shortformUploadFile(long userId, ShortformUploadMultipartRequest request);

	ShortformFindResponse findShortform(long shortformId);

	List<ShortformFindResponse> findShortformList(int count);

	void deleteShortForm(long shortformId);

}
