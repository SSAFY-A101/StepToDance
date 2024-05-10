package com.dance101.steptodance.feedback.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.dance101.steptodance.feedback.domain.FeedbackBodyModel;

@Repository
public interface FeedbackBodyRepository extends CrudRepository<FeedbackBodyModel, String> {
	Optional<FeedbackBodyModel> findByFeedbackId(long guideId);
}