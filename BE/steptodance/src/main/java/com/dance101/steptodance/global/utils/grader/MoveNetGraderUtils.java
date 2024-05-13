package com.dance101.steptodance.global.utils.grader;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.lang.Double;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MoveNetGraderUtils implements GraderUtils<Double>{

	private List<List<Integer>> gradingCriteria;
	private final int SIZE_OF_CRITERIA = 10;
	private final MathContext mc = new MathContext(7, RoundingMode.HALF_UP);

	public MoveNetGraderUtils() {
		this.gradingCriteria = new ArrayList<>();
		gradingCriteria.add(List.of(8, 6, 12)); // right shoulder
		gradingCriteria.add(List.of(6, 8, 10)); // right elbow
		gradingCriteria.add(List.of(7, 5, 11)); // left shoulder
		gradingCriteria.add(List.of(5, 7, 9)); // left elbow

		gradingCriteria.add(List.of(5, 6, 12)); // right shoulder - shoulder - hip
		gradingCriteria.add(List.of(6, 5, 11)); // left shoulder - shoulder - hip
		gradingCriteria.add(List.of(11, 12, 14)); // right hip - hip - knee
		gradingCriteria.add(List.of(12, 11, 13)); // left hip - hip - knee

		gradingCriteria.add(List.of(12, 14, 16)); // right knee
		gradingCriteria.add(List.of(11, 13, 15)); // left knee
	}

	@Override
	public double getDeduct(List<List<Double>> guide, List<List<Double>> feedback) {
		double sum = 0.0;
		for (int i = 0; i < SIZE_OF_CRITERIA; i++) {
			sum += Math.abs(getAngle(i, guide) - getAngle(i, feedback)) / 100;
		}
		log.info("getDeduct: deduct( " + sum + " )");
		return sum;
	}

	private double getAngle(int ci, List<List<Double>> body) {
		BigDecimal y1 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(0)).get(0));
		BigDecimal x1 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(0)).get(1));
		BigDecimal y2 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(1)).get(0));
		BigDecimal x2 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(1)).get(1));
		BigDecimal y3 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(2)).get(0));
		BigDecimal x3 = BigDecimal.valueOf(body.get(gradingCriteria.get(ci).get(2)).get(1));

		BigDecimal vector1X = x2.subtract(x1);
		BigDecimal vector1Y = y2.subtract(y1);
		BigDecimal vector2X = x3.subtract(x2);
		BigDecimal vector2Y = y3.subtract(y2);

		BigDecimal dotProduct = vector1X.multiply(vector2X).add(vector1Y.multiply(vector2Y));
		BigDecimal vector1Length = vector1X.multiply(vector1X).add(vector1Y.multiply(vector1Y)).sqrt(mc);
		vector1Length = vector1Length.doubleValue() == 0.0 ? new BigDecimal("0.0000001") : vector1Length;
		BigDecimal vector2Length = vector2X.multiply(vector2X).add(vector2Y.multiply(vector2Y)).sqrt(mc);
		vector2Length = vector2Length.doubleValue() == 0.0 ? new BigDecimal("0.0000001") : vector2Length;

		// if (dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue() > 1.0 || dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue() < -1.0) {
		// 	log.info("================================ problem occurred! ================================");
		// 	log.info("{y1, x1, y2, x2, y3, x3} : " + Arrays.toString(new double[] {y1, x1, y2, x2, y3, x3}));
		// 	log.info("{vector1Y, vector1X, vector2Y, vector2X} : " + Arrays.toString(new double[] {vector1Y.doubleValue(), vector1X.doubleValue(), vector2Y.doubleValue(), vector2X.doubleValue()}));
		// 	log.info("getAngle: dotProduct= " + dotProduct);
		// 	log.info("getAngle: vector1Length= " + vector1Length);
		// 	log.info("getAngle: vector2Length= " + vector2Length);
		// 	log.info("getAngle: (vector1Length * vector2Length)= " + (vector1Length.multiply(vector2Length)));
		// 	log.info("getAngle: dotProduct / (vector1Length * vector2Length)= " + dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue());
		// }
		// 라디안 각도를 반환
		double acos = Math.acos(dotProduct.divide(vector1Length.multiply(vector2Length), mc).doubleValue());
		return acos;
	}
}
