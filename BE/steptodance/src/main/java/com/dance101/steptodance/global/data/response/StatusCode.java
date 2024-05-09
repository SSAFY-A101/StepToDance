package com.dance101.steptodance.global.data.response;

import lombok.Getter;

@Getter
public enum StatusCode {
    // AUTH
    SUCCESS_LOGIN(201, "로그인 성공"),
    SUCCESS_LOGOUT(200, "로그아웃 성공"),
    SUCCESS_REISSUE(200, "토큰 재발급 성공"),

    // USER
    SUCCESS_QUIT(204, "탈퇴 성공"),
    SUCCESS_MYPAGE(200, "마이페이지 조회 성공"),
    SUCCESS_RANKING_LIST(200, "랭킹 목록 조회 성공"),

    // GUIDE
    SUCCESS_GUIDE_LIST(200, "가이드 목록 조회 성공"),
    SUCCESS_GUIDE_ONE(200, "가이드 상세 조회 성공"),
    CREATED_GUIDE(201, "가이드 업로드 요청"),

    // FEEDBACK
    SUCCESS_FEEDBACK_ONE(200, "피드백 상세 조회 성공"),
    SUCCESS_FEEDBACK_CREATION(201, "피드백 생성 성공"),
    SUCCESS_FEEDBACK_DELETION(204, "피드백 삭제 성공"),

    // SHORTS
    SUCCESS_SHORTS_LIST(200, "숏폼 목록 조회 성공"),
    SUCCESS_SHORTS_ONE(200, "숏폼 상세 조회 성공"),
    SUCCESS_SHORTS_CREATION(201, "숏폼 생성 성공"),
    SUCCESS_SHORTS_SHARE(200, "숏폼 공유 성공"),
    SUCCESS_SHORTS_DELETION(204, "숏폼 삭제 성공");

    private final int status;
    private final String message;

    StatusCode(final int status, final String message) {
        this.status = status;
        this.message = message;
    }
}
