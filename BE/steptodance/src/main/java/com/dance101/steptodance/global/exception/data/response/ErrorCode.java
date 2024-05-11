package com.dance101.steptodance.global.exception.data.response;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // AUTH
    UNAUTHORIZED_USER(403, "인증이 필요한 서비스입니다."),
    FORBIDDEN_USER(403, "권한이 없는 서비스입니다."),
    COOKIE_NOT_FOUND(404, "쿠키를 찾을 수 없습니다."),
    REFRESH_TOKEN_NOT_FOUND(404, "리프레시 토큰을 찾을 수 없습니다."),
    // USER
    UNDEFINED_USER(404, "회원을 찾을 수 없습니다."),
    // GUIDE
    GUIDE_NOT_FOUND(404, "가이드를 찾을 수 없습니다."),
    GUIDE_BODY_NOT_FOUND(404, "가이드모델을 찾을 수 없습니다."),
    GUIDE_UPLOAD_FAILED(404, "가이드 업로드에 실패했습니다."),
    // KAFKA
    KAFKA_INVALID_TOPIC(403, "존재하지 않는 kafka 토픽입니다."),
    // GENRE
    GENRE_NOT_FOUND(404, "장르를 찾을 수 없습니다."),
    // FEEDBACK
    FEEDBACK_NOT_FOUND(404, "피드백을 찾을 수 없습니다."),
    FEEDBACK_BODY_NOT_FOUND(404, "피드백모델을 찾을 수 없습니다."),
    //SHORTFORM
    SHORTFORM_NOT_FOUND(404,"숏폼을 찾을 수 없습니다."),
    SHORTFORM_UPLOAD_FAILED(404,"숏폼 업로드에 실패했습니다."),
    // JSON PARSE
    JSON_PARSE_CAN_NOT_BE_DONE(500, "객체 직렬화 도중 문제가 발생하였습니다.");

    private final int status;
    private final String message;

    ErrorCode(final int status, final String message) {
        this.status = status;
        this.message = message;
    }
}
