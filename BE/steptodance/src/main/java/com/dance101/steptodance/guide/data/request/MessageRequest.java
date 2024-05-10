package com.dance101.steptodance.guide.data.request;

import lombok.Builder;

@Builder
public record MessageRequest(
	String type,
	long id,
	String name,
	int size,
	byte[] image
) {
}
