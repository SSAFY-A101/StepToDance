package com.dance101.steptodance.shortform.data.request;

import java.io.Serializable;
import java.time.LocalTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ShortformUploadMultipartRequest implements Serializable {
	private long guide_id;
	private MultipartFile video;
	private LocalTime startAt;
	private LocalTime endAt;
}
