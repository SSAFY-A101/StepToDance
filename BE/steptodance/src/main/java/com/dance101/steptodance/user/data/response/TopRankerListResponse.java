package com.dance101.steptodance.user.data.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TopRankerListResponse(
	@JsonProperty("id") Long userId,
    @JsonProperty("nickname") String nickname,
    @JsonProperty("profile_img_url") String profileImgUrl,
    @JsonProperty("score") double score,
    @JsonProperty("rank") int rank
) {
}
