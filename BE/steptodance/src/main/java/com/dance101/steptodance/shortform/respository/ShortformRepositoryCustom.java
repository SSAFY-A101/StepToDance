package com.dance101.steptodance.shortform.respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;

public interface ShortformRepositoryCustom {
	Page<ShortformFindResponse> findShortformList(Pageable pageable);

	Optional<ShortformFindResponse> findShortformById(long shortformId);

	List<ShortformFindResponse> findShortformByUserId(long userId);
}

