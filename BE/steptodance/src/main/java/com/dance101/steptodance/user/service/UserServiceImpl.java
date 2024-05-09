package com.dance101.steptodance.user.service;

import com.dance101.steptodance.feedback.repository.FeedbackRepository;
import com.dance101.steptodance.feedback.utils.FeedbackUtils;
import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;
import com.dance101.steptodance.shortform.respository.ShortformRepository;
import com.dance101.steptodance.user.data.response.*;
import com.dance101.steptodance.user.domain.User;
import com.dance101.steptodance.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.UNDEFINED_USER;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final ShortformRepository shortformRepository;

    @Transactional
    @Override
    public void deleteUser(long userId) {
        // get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("UserServiceImpl:deleteUser", UNDEFINED_USER));

        // delete user
        userRepository.delete(user);
    }

    @Override
    public MyPageResponse findMyPage(long userId, int limit, int offset) {
        // get user
        UserFindResponse userFindResponse = userRepository.findUserByUserId(userId)
            .orElseThrow(() -> new NotFoundException("UserServiceImpl:findMyPage", UNDEFINED_USER));

        // find feedback list
        List<FeedbackListFindResponse> feedbackListFindResponses = FeedbackUtils.findFeedbackListByUserId(feedbackRepository, userId, limit, offset);

        // find shortform list
        List<ShortformFindResponse> shortformFindResponses = shortformRepository.findShortformByUserId(userId);

        // create response & return
        return MyPageResponse.builder()
            .userFindResponse(userFindResponse)
            .feedbackListFindResponses(feedbackListFindResponses)
            .shortformFindResponses(shortformFindResponses)
            .build();
    }

    @Override
    public RankFindResponse findRanks(long userId) {
        // get top rankers list
        List<TopRankerListResponse> topRankerList = userRepository.findTopRankerList();

        // get my rank
        MyRankResponse myRankResponse = userRepository.findMyRankInfo(userId)
            .orElseThrow(() -> new NotFoundException("UserServiceImpl:findRanks", UNDEFINED_USER));

        // return
        return RankFindResponse.builder()
            .topRankerListResponse(topRankerList)
            .myRankResponse(myRankResponse)
            .build();
    }

    @Override
    public UserPageResponse findUserPage(long userId) {
        // get user
        UserFindResponse userFindResponse = userRepository.findUserByUserId(userId)
            .orElseThrow(() -> new NotFoundException("UserServiceImpl:findMyPage", UNDEFINED_USER));

        // find shortform list
        List<ShortformFindResponse> shortformFindResponses = shortformRepository.findShortformByUserId(userId);

        // create response & return
        return UserPageResponse.builder()
            .userFindResponse(userFindResponse)
            .shortformFindResponses(shortformFindResponses)
            .build();
    }
}
