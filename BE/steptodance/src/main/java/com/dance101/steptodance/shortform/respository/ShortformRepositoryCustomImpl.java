package com.dance101.steptodance.shortform.respository;

import static com.dance101.steptodance.guide.domain.QGuide.*;
import static com.dance101.steptodance.shortform.domain.QShortform.*;
import static com.dance101.steptodance.user.domain.QUser.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class ShortformRepositoryCustomImpl implements ShortformRepositoryCustom{
	private final JPAQueryFactory queryFactory;

	@Override
	public Page<ShortformFindResponse> findShortformList(Pageable pageable) {
		List<ShortformFindResponse> content = queryFactory
			.select(Projections.constructor(ShortformFindResponse.class,
				shortform.id,
				guide.id,
				user.id,
				shortform.videoUrl,
				guide.songTitle,
				guide.singer,
				user.nickname,
				shortform.createdAt
				))
			.from(shortform)
			.innerJoin(guide).on(guide.id.eq(shortform.guide.id))
			.innerJoin(user).on(user.id.eq(shortform.user.id))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long count = queryFactory
			.select(shortform.count())
			.from(shortform)
			.fetchOne();

		return new PageImpl<>(content, pageable, count);
	}

	@Override
	public Optional<ShortformFindResponse> findShortformById(long shortformId) {
		return Optional.ofNullable(
			queryFactory.select(Projections.constructor(ShortformFindResponse.class,
				shortform.id,
				guide.id,
				user.id,
				shortform.videoUrl,
				guide.songTitle,
				guide.singer,
				user.nickname,
				shortform.createdAt
				))
				.from(shortform)
				.innerJoin(guide).on(guide.id.eq(shortform.guide.id))
				.innerJoin(user).on(user.id.eq(shortform.user.id))
				.where(shortform.id.eq(shortformId))
				.fetchOne()
		);
	}

	@Override
	public List<ShortformFindResponse> findShortformByUserId(long userId) {
		return queryFactory
			.select(Projections.constructor(ShortformFindResponse.class,
				shortform.id,
				guide.id,
				user.id,
				shortform.videoUrl,
				guide.songTitle,
				guide.singer,
				user.nickname,
				shortform.createdAt
			))
			.from(shortform)
			.innerJoin(guide).on(guide.id.eq(shortform.guide.id))
			.innerJoin(user).on(user.id.eq(shortform.user.id))
			.where(shortform.user.id.eq(userId))
			.fetch();
	}
}
