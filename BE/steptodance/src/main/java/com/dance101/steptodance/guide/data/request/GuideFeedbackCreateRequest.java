package com.dance101.steptodance.guide.data.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class GuideFeedbackCreateRequest implements Serializable {
    private LocalTime startAt;

    private LocalTime endAt;

	private MultipartFile video;
}
