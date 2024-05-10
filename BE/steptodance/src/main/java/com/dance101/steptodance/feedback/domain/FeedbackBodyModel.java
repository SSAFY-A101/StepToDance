package com.dance101.steptodance.feedback.domain;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "feedback_body_model")
public class FeedbackBodyModel {
	@Field("feedbackId")
	private long feedbackId;

	@Id
	private String id;

	@Field("model")
	List<List<List<Integer>>> models;

	@Builder
	public FeedbackBodyModel(long feedbackId, List<List<List<Integer>>> models) {
		this.feedbackId = feedbackId;
		this.models = models;
	}
}