package com.dance101.steptodance.guide.domain;

import com.dance101.steptodance.global.domain.BaseEntity;
import com.dance101.steptodance.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "GUIDE_TBL")
@Entity
public class Guide extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guide_id")
    private Long id;

    @Column(name = "video_url", length = 3000)
    private String videoUrl;

    @Column(name = "thumbnail_img_url", length = 3000)
    private String thumbnailImgUrl;

    @Column(name = "song_title")
    private String songTitle;

    @Column(name = "singer")
    private String singer;

    @Column(name = "highlight_section_start_at")
    private LocalTime highlightSectionStartAt;

    @Column(name = "highlight_section_end_at")
    private LocalTime highlightSectionEndAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @Builder
    public Guide(String videoUrl, String thumbnailImgUrl, String songTitle, String singer, User user, Genre genre, LocalTime highlightSectionStartAt, LocalTime highlightSectionEndAt) {
        this.videoUrl = videoUrl;
        this.thumbnailImgUrl = thumbnailImgUrl;
        this.songTitle = songTitle;
        this.singer = singer;
        this.user = user;
        this.genre = genre;
        this.highlightSectionStartAt = highlightSectionStartAt;
        this.highlightSectionEndAt = highlightSectionEndAt;
    }

    public void addUrl(String url) {
        this.videoUrl = url;
    }
}
