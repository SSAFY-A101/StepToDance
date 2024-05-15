package com.dance101.steptodance.feedback.data.response;

import java.time.LocalTime;
import java.util.List;

import com.dance101.steptodance.feedback.domain.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FeedbackResultData {
	double score;
	List<LocalTime> incorrectSectionList;
}
