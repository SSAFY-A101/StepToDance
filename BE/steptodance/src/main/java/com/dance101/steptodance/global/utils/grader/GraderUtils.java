package com.dance101.steptodance.global.utils.grader;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.dance101.steptodance.feedback.data.response.FeedbackResultData;

public interface GraderUtils<BodyType> {
	double getDeduct(List<List<BodyType>> guide, List<List<BodyType>> feedback);

	default double getScore(int start, int end, List<List<List<BodyType>>> guide, List<List<List<BodyType>>> feedback) {
		double ans = 0;
		for (int i = start; i < end; i++) {
			ans += getDeduct(guide.get(i), feedback.get(i));
		}
		System.out.println("totalDeduct = " + ans);
		System.out.println("totalDeduct / size = " + ans / (end - start));
		return ans / (end - start) * 100;
	}

	default FeedbackResultData getScoreResult(int start, int end, List<List<List<BodyType>>> guide, List<List<List<BodyType>>> feedback) {
		double ans = 0;
		double standard = 0.85;
		List<LocalTime> incorrectTimeList = new ArrayList<>();
		double deduct = 0.0;
		double deductLast = 1.0;
		int wrongSectionLasts = 3 * 4; // 1초당 4프레임. 3초동안 추가 안하기
		int leftTime = 0;

		for (int i = start; i < end; i++) {
			deduct = getDeduct(guide.get(i), feedback.get(i));
			ans += deduct;
			if (leftTime <= 0) {
				if (deduct <= standard && deductLast <= standard) {
					int second = i / 4;
					int minute = second / 60;
					second %= 60;
					incorrectTimeList.add(LocalTime.of(0, minute, second));
					leftTime = wrongSectionLasts;
				}
			}
			leftTime--;
			deductLast = deduct;
		}
		System.out.println("totalDeduct = " + ans);
		System.out.println("totalDeduct / size = " + ans / (end - start));
		double score = ans / (end - start) * 100;
		return new FeedbackResultData(score, incorrectTimeList);
	}
}
