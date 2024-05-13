package com.dance101.steptodance.global.utils.grader;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CaffeGraderUtils implements GraderUtils{
	private List<List<Integer>> gradingCriteria;
	private final int SIZE_OF_CRITERIA = 13;
	private final MathContext mc = new MathContext(7, RoundingMode.HALF_UP);

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
		int y1 = body.get(gradingCriteria.get(ci).get(0)).get(0);
		int x1 = body.get(gradingCriteria.get(ci).get(0)).get(1);
		int y2 = body.get(gradingCriteria.get(ci).get(1)).get(0);
		int x2 = body.get(gradingCriteria.get(ci).get(1)).get(1);
		int y3 = body.get(gradingCriteria.get(ci).get(2)).get(0);
		int x3 = body.get(gradingCriteria.get(ci).get(2)).get(1);

		BigDecimal vector1X = new BigDecimal(x2 - x1);
		BigDecimal vector1Y = new BigDecimal(y2 - y1);
		BigDecimal vector2X = new BigDecimal(x3 - x2);
		BigDecimal vector2Y = new BigDecimal(y3 - y2);

		BigDecimal dotProduct = vector1X.multiply(vector2X ).add(vector1Y.multiply(vector2Y));
		BigDecimal vector1Length = vector1X.multiply(vector1X).add(vector1Y.multiply(vector1Y)).sqrt(mc);
		vector1Length = vector1Length.doubleValue() == 0.0 ? new BigDecimal("0.0000001") : vector1Length;
		BigDecimal vector2Length = vector2X.multiply(vector2X).add(vector2Y.multiply(vector2Y)).sqrt(mc);
		vector2Length = vector2Length.doubleValue() == 0.0 ? new BigDecimal("0.0000001") : vector2Length;

		if (dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue() > 1.0 || dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue() < -1.0) {
			log.info("================================ problem occurred! ================================");
			log.info("{y1, x1, y2, x2, y3, x3} : " + Arrays.toString(new double[] {y1, x1, y2, x2, y3, x3}));
			log.info("{vector1Y, vector1X, vector2Y, vector2X} : " + Arrays.toString(new double[] {vector1Y.doubleValue(), vector1X.doubleValue(), vector2Y.doubleValue(), vector2X.doubleValue()}));
			log.info("getAngle: dotProduct= " + dotProduct);
			log.info("getAngle: vector1Length= " + vector1Length);
			log.info("getAngle: vector2Length= " + vector2Length);
			log.info("getAngle: (vector1Length * vector2Length)= " + (vector1Length.multiply(vector2Length)));
			log.info("getAngle: dotProduct / (vector1Length * vector2Length)= " + dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue());
		}
		// 라디안 각도를 반환
		double acos = Math.acos(dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue());
		return acos;
	}
}
