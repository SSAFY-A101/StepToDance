package com.dance101.steptodance.user.controller;

import com.dance101.steptodance.auth.utils.SecurityUser;
import com.dance101.steptodance.global.data.response.ApiResponse;
import com.dance101.steptodance.user.data.response.MyPageResponse;
import com.dance101.steptodance.user.data.response.RankFindResponse;
import com.dance101.steptodance.user.data.response.UserPageResponse;
import com.dance101.steptodance.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static com.dance101.steptodance.global.data.response.StatusCode.*;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;

@RequiredArgsConstructor
@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal SecurityUser securityUser) {
        long userId = securityUser.getId();
        userService.deleteUser(userId);
        return ApiResponse.toEmptyResponse(NO_CONTENT, SUCCESS_QUIT);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MyPageResponse>> findMyPage(
        @AuthenticationPrincipal SecurityUser securityUser, @RequestParam int limit, @RequestParam int offset
    ) {
        long userId = securityUser.getId();
        MyPageResponse response = userService.findMyPage(userId, limit, offset);
        return ApiResponse.toResponse(OK, SUCCESS_MYPAGE, response);
    }

    @GetMapping("/rank")
    public ResponseEntity<ApiResponse<RankFindResponse>> findRanks(@AuthenticationPrincipal SecurityUser securityUser) {
        long userId = securityUser.getId();
        RankFindResponse response = userService.findRanks(userId);
        return ApiResponse.toResponse(OK, SUCCESS_RANKING_LIST, response);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<ApiResponse<UserPageResponse>> findUserPage(
        @PathVariable("user_id") long userId
    ) {
        UserPageResponse response = userService.findUserPage(userId);
        return ApiResponse.toResponse(OK, SUCCESS_MYPAGE, response);
    }
}
