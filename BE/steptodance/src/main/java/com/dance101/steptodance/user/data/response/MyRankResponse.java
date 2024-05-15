package com.dance101.steptodance.user.data.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MyRankResponse(
	@JsonProperty("user_id") Long userId,
    @JsonProperty("nickname") String nickname,
    @JsonProperty("profile_img_url") String profileImgUrl,
    @JsonProperty("score") double score,
    @JsonProperty("rank") long ranking
) {
}
