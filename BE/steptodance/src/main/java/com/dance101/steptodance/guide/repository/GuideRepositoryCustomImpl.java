package com.dance101.steptodance.guide.repository;

import com.dance101.steptodance.global.utils.QueryUtils;
import com.dance101.steptodance.guide.data.request.SearchConditions;
import com.dance101.steptodance.guide.data.response.GuideFindResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

import static com.dance101.steptodance.feedback.domain.QFeedback.feedback;
import static com.dance101.steptodance.guide.domain.QGenre.genre;
import static com.dance101.steptodance.guide.domain.QGuide.guide;

@Slf4j
@RequiredArgsConstructor
public class GuideRepositoryCustomImpl implements GuideRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final QueryUtils queryUtils;

    @Override
    public List<GuideFindResponse> findGuideListWithSearchConditions(SearchConditions searchConditions, long userId) {
        if (searchConditions.getLimit() == null) {
            searchConditions.setLimit(10);
        }
        if (searchConditions.getOffset() == null) {
            searchConditions.setOffset(0);
        }
        searchConditions.setOffset(
            (searchConditions.getOffset() - 1) * searchConditions.getLimit());

        log.info("SearchCondition: " + searchConditions);
        return queryFactory.select(Projections.constructor(GuideFindResponse.class,
            guide.id,
            guide.videoUrl,
            guide.thumbnailImgUrl,
            guide.songTitle,
            guide.singer,
            guide.genre.name,
            queryUtils.createRankingSQL(feedback.count()),
            guide.user.nickname,
            feedback.count(),
            guide.createdAt))
            .from(guide).leftJoin(feedback).on(feedback.guide.id.eq(guide.id))
            .where(
                categorySearch(searchConditions.getCategory(), userId)
                    .or(titleSearch(searchConditions.getTitle()))
                    .or(singerSearch(searchConditions.getSinger()))
                    .or(uploaderSearch(searchConditions.getUploader())))
            .groupBy(guide.id)
            .limit(searchConditions.getLimit())
            .offset(searchConditions.getOffset())
            .fetch();
    }

    @Override
    public List<GuideFindResponse> findHotGuideList() {
        return queryFactory.select(Projections.constructor(GuideFindResponse.class,
                guide.id,
                guide.videoUrl,
                guide.thumbnailImgUrl,
                guide.songTitle,
                guide.singer,
                guide.genre.name,
                queryUtils.createRankingSQL(feedback.count()),
                guide.user.nickname,
                feedback.count(),
                guide.createdAt))
            .from(guide).leftJoin(feedback).on(feedback.guide.id.eq(guide.id))
            .where(
            )
            .groupBy(guide.id)
            .orderBy(queryUtils.createRankingSQL(feedback.count()).asc()) // rank를 오름차순으로 정렬
            .limit(5) // 상위 5개만 조회
            .fetch();
    }

    @Override
    public Optional<GuideFindResponse> findGuideByGuideId(long guideId) {
        return Optional.ofNullable(
            queryFactory.select(Projections.constructor(GuideFindResponse.class,
                    guide.id,
                    guide.videoUrl,
                    guide.thumbnailImgUrl,
                    guide.songTitle,
                    guide.singer,
                    guide.genre.name,
                    queryUtils.createRankingSQL(feedback.count()),
                    guide.user.nickname,
                    feedback.count(),
                    guide.createdAt
                ))
                .from(guide).leftJoin(feedback).on(feedback.guide.id.eq(guide.id))
                .where(guide.id.eq(guideId))
                .fetchOne()
        );
    }

    private BooleanExpression uploaderSearch(String uploader) {
        if (StringUtil.isNullOrEmpty(uploader)) {
            return null;
        }
        return guide.user.nickname.like("%"+uploader+"%");
    }

    private BooleanExpression singerSearch(String singer) {
        if (StringUtil.isNullOrEmpty(singer)) {
            return null;
        }
        return guide.singer.like("%"+singer+"%");
    }

    private BooleanExpression titleSearch(String title) {
        if (StringUtil.isNullOrEmpty(title)) {
            return null;
        }
        return guide.songTitle.like("%" + title + "%");
    }

    private BooleanExpression categorySearch(String category, long userId) {
        if (StringUtil.isNullOrEmpty(category)) {
            return null;
        } else if (category.equals("custom")) {
            category = queryFactory.select(genre.name)
                .from(guide)
                .innerJoin(genre).on(genre.id.eq(guide.genre.id))
                .where(guide.id.eq(
                    JPAExpressions.select(guide.id)
                        .from(feedback)
                        .where(feedback.user.id.eq(userId))
                        .groupBy(feedback.guide.id)
                        .orderBy(feedback.id.count().desc())
                        .limit(1)
                ))
                .fetchOne();
        }
        return guide.genre.name.like("%" + category+ "%");
    }

}
