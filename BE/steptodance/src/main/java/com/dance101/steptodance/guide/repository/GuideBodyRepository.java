package com.dance101.steptodance.guide.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.dance101.steptodance.guide.domain.GuideBodyModel;

@Repository
public interface GuideBodyRepository extends CrudRepository<GuideBodyModel<Double>, String> {
	Optional<GuideBodyModel<Double>> findByGuideId(long guideId);
}