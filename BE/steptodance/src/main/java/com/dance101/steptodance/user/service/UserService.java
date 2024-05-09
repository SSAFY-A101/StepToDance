package com.dance101.steptodance.user.service;

import com.dance101.steptodance.user.data.response.MyPageResponse;
import com.dance101.steptodance.user.data.response.RankFindResponse;
import com.dance101.steptodance.user.data.response.UserPageResponse;

public interface UserService {
    void deleteUser(long userId);

    MyPageResponse findMyPage(long userId, int limit, int offset);

    RankFindResponse findRanks(long userId);

    UserPageResponse findUserPage(long userId);
}
