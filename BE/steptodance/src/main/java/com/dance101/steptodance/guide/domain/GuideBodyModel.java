package com.dance101.steptodance.guide.domain;

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
@Document(collection = "guide_body_model")
public class GuideBodyModel {
	@Field("guideId")
	private long guideId;

	@Id
	private String id;

	@Field("model")
	List<List<List<Integer>>> models;

	@Builder
	public GuideBodyModel(long guideId, List<List<List<Integer>>> models) {
		this.guideId = guideId;
		this.models = models;
	}
}