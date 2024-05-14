package com.dance101.steptodance.user.data.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserFindResponse(
	@JsonProperty("id") Long userId,
    @JsonProperty("profile_img_url") String profileImgUrl,
    @JsonProperty("nickname") String nickname,
	@JsonProperty("score") double score,
    @JsonProperty("user_rank") long ranking
) {
}
