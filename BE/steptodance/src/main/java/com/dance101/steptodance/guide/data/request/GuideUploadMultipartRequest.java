package com.dance101.steptodance.guide.data.request;

import java.io.Serializable;
import java.time.LocalTime;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GuideUploadMultipartRequest implements Serializable {
	private long genre_id;

	private String song_title;

	private String singer;

	private LocalTime highlight_section_start_at;

	private LocalTime highlight_section_end_at;

	private MultipartFile video;
}