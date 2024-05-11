package com.dance101.steptodance.global.utils.grader;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CaffeGraderUtils implements GraderUtils{
	private List<List<Integer>> gradingCriteria;
	private final int SIZE_OF_CRITERIA = 13;

	public CaffeGraderUtils() {
		gradingCriteria = new ArrayList<>();
		gradingCriteria.add(List.of(0, 1, 14)); // neck

		gradingCriteria.add(List.of(2, 1, 14)); // right shoulder
		gradingCriteria.add(List.of(1, 2, 3)); // right elbow
		gradingCriteria.add(List.of(2, 3, 4)); // right wrist

		gradingCriteria.add(List.of(5, 1, 14)); // left shoulder
		gradingCriteria.add(List.of(1, 5, 6)); // left elbow
		gradingCriteria.add(List.of(5, 6, 7)); // left wrist

		gradingCriteria.add(List.of(1, 14, 8)); // right hip
		gradingCriteria.add(List.of(14, 8, 9)); // right knee
		gradingCriteria.add(List.of(8, 9, 10)); // right ankle

		gradingCriteria.add(List.of(1, 14, 11)); // left hip
		gradingCriteria.add(List.of(14, 11, 12)); // left knee
		gradingCriteria.add(List.of(11, 12, 13)); // left ankle
	}

	@Override
	public double getDeduct(List<List<Integer>> guide, List<List<Integer>> feedback) {
		double sum = 0.0;
		for (int i = 0; i < SIZE_OF_CRITERIA; i++) {
			sum += Math.abs(getAngle(i, guide) - getAngle(i, feedback)) / 2;
		}
		log.info("getDeduct: deduct( " + sum + " )");
		return sum;
	}

	private double getAngle(int ci, List<List<Integer>> body) {
		double y1 = body.get(gradingCriteria.get(ci).get(0)).get(0);
		double x1 = body.get(gradingCriteria.get(ci).get(0)).get(1);
		double y2 = body.get(gradingCriteria.get(ci).get(1)).get(0);
		double x2 = body.get(gradingCriteria.get(ci).get(1)).get(1);
		double y3 = body.get(gradingCriteria.get(ci).get(2)).get(0);
		double x3 = body.get(gradingCriteria.get(ci).get(2)).get(1);
		return ((y2 - y1) / (x2 - x1)) - ((y3 - y2) / (x3 - x2));
	}
}
