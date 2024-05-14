package com.dance101.steptodance.global.utils.grader;

import java.util.List;

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
}
