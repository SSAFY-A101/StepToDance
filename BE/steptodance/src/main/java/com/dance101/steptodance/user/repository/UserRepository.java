package com.dance101.steptodance.user.repository;

import com.dance101.steptodance.user.data.response.MyRankResponse;
import com.dance101.steptodance.user.data.response.UserFindResponse;
import com.dance101.steptodance.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
    boolean existsByKakaoId(String kakaoId);

    Optional<User> findByKakaoId(String kakaoId);

    @Query("select new com.dance101.steptodance.user.data.response.MyRankResponse(sub.nickname, sub.profileImgUrl, sub.score, sub.ranking) " +
        "from (select u.id as id, u.nickname as nickname, u.profileImgUrl as profileImgUrl, ifnull(sum(f.score), 0) as score, rank() over (order by sum(f.score) desc) as ranking " +
        "from User u left join Feedback f on u.id = f.user.id " +
        "group by u.id) as sub " +
        "where sub.id = :userId")
    Optional<MyRankResponse> findMyRankInfo(@Param("userId") long userId);

    @Query("select new com.dance101.steptodance.user.data.response.UserFindResponse(sub.profileImgUrl, sub.nickname, sub.ranking) " +
        "from (select u.id as id, u.nickname as nickname, u.profileImgUrl as profileImgUrl, rank() over (order by sum(f.score) desc) as ranking " +
        "from User u left join Feedback f on u.id = f.user.id " +
        "group by u.id) as sub " +
        "where sub.id = :userId")
    Optional<UserFindResponse> findUserByUserId(@Param("userId") long userId);
}
