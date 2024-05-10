package com.dance101.steptodance.user.data.response;

import java.util.List;

import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder
public record UserPageResponse(
	@JsonProperty("user") UserFindResponse userFindResponse,
	@JsonProperty("shortform_list") List<ShortformFindResponse> shortformFindResponses
) {

}
