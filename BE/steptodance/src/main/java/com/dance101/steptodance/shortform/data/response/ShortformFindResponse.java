package com.dance101.steptodance.shortform.data.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ShortformFindResponse(
	@JsonProperty("id") long id,
	@JsonProperty("guide_id") long guideId,
	@JsonProperty("uploader_id") long uploaderId,
	@JsonProperty("video_url") String videoUrl,
	@JsonProperty("song_title") String songTitle,
	@JsonProperty("singer") String singer,
	@JsonProperty("uploader") String uploader,
	@JsonProperty("created_at") LocalDateTime createdAt
) {

}
