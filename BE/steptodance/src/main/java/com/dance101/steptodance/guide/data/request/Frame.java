package com.dance101.steptodance.guide.data.request;

import java.util.List;

import lombok.Getter;

@Getter
public class Frame<BodyType> {
	String name;
	List<List<BodyType>> model;
}
