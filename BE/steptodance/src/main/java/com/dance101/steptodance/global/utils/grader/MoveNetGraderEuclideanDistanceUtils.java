package com.dance101.steptodance.global.utils.grader;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MoveNetGraderEuclideanDistanceUtils implements GraderUtils<Double>{
	private final int NUM_JOINT = 17;
	private final MathContext mc = new MathContext(7, RoundingMode.HALF_UP);

	@Override
	public double getDeduct(List<List<Double>> guide, List<List<Double>> feedback) {
		double similarity = compareModels(guide, feedback);
		log.info("similarity: ================" + similarity + "================");
		return similarity;
	}

	private double compareModels(List<List<Double>> guide, List<List<Double>> feedback) {
		BigDecimal totalDistance = new BigDecimal("0.0");
		for (int i = 0; i < NUM_JOINT; i++) {
			totalDistance = totalDistance.add(euclideanDistance2D(guide.get(i), feedback.get(i)));
		}
		BigDecimal similarity = new BigDecimal("1.0").subtract(totalDistance.divide(new BigDecimal(NUM_JOINT), mc));
		return similarity.doubleValue();
	}

	private BigDecimal euclideanDistance2D(List<Double> guides, List<Double> feedback) {
		BigDecimal x1 = BigDecimal.valueOf(guides.get(0));
		BigDecimal y1 = BigDecimal.valueOf(guides.get(1));
		BigDecimal x2 = BigDecimal.valueOf(feedback.get(0));
		BigDecimal y2 = BigDecimal.valueOf(feedback.get(1));

		BigDecimal dx = x2.subtract(x1);
		BigDecimal dy = y2.subtract(y1);
		return dx.multiply(dx).add(dy.multiply(dy)).sqrt(mc);
	}
}
