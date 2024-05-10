package com.dance101.steptodance.feedback.domain;

import com.dance101.steptodance.global.domain.BaseEntity;
import com.dance101.steptodance.guide.domain.Guide;
import com.dance101.steptodance.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "FEEDBACK_TBL")
@Entity
public class Feedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long id;

    @Column(name = "video_url", length = 3000)
    private String videoUrl;

    @Column(name = "score")
    private Double score;

    @Column(name = "thumbnail_img_url", length = 3000)
    private String thumbnailImgUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    private Guide guide;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Feedback(String videoUrl, Double score, String thumbnailImgUrl, Guide guide, User user) {
        this.videoUrl = videoUrl;
        this.score = score;
        this.thumbnailImgUrl = thumbnailImgUrl;
        this.guide = guide;
        this.user = user;
    }

    public void update(double score) {
        this.score = score;
    }

    public void addUrl(String url) {
        this.videoUrl = url;
    }

    public void addThumbnailUrl(String url) {
        this.thumbnailImgUrl = url;
    }
}
