package com.dance101.steptodance.global.utils.grader;

import java.util.List;

public interface GraderUtils {
	double getDeduct(List<List<Integer>> guide, List<List<Integer>> feedback);

	default double getScore(int start, int end, List<List<List<Integer>>> guide, List<List<List<Integer>>> feedback) {
		double ans = 0;
		for (int i = start; i < end; i++) {
			ans -= getDeduct(guide.get(i), feedback.get(i));
		}
		return Math.max(0, ans);
	}
}
