package com.dance101.steptodance.user.repository;

import com.dance101.steptodance.global.utils.QueryUtils;
import com.dance101.steptodance.user.data.response.TopRankerListResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.dance101.steptodance.feedback.domain.QFeedback.feedback;
import static com.dance101.steptodance.user.domain.QUser.user;

@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final QueryUtils queryUtils;

    @Override
    public List<TopRankerListResponse> findTopRankerList() {
        return queryFactory.select(Projections.constructor(TopRankerListResponse.class,
                user.id,
                user.nickname,
                user.profileImgUrl,
                feedback.score.sum(),
                queryUtils.createRankingSQL(feedback.score.sum())
            ))
            .from(user)
            .leftJoin(feedback).on(feedback.user.id.eq(user.id))
            .groupBy(user.id)
            .orderBy(feedback.score.sum().desc())
            .limit(10)
            .fetch();
    }
}
