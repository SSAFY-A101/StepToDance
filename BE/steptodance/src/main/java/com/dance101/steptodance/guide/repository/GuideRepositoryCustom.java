package com.dance101.steptodance.guide.repository;

import com.dance101.steptodance.guide.data.request.SearchConditions;
import com.dance101.steptodance.guide.data.response.GuideFindResponse;

import java.util.List;
import java.util.Optional;

public interface GuideRepositoryCustom {
    List<GuideFindResponse> findGuideListWithSearchConditions(SearchConditions searchConditions, long userId);

    List<GuideFindResponse> findHotGuideList();

    Optional<GuideFindResponse> findGuideByGuideId(long guideId);
}
