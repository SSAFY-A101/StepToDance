package com.dance101.steptodance.shortform.domain;

import com.dance101.steptodance.global.domain.BaseEntity;
import com.dance101.steptodance.guide.domain.Guide;
import com.dance101.steptodance.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "SHORTFORM_TBL")
@Entity
public class Shortform extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shortform_id")
	private Long id;

	@Column(name = "video_url", length = 3000)
	private String videoUrl;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "guide_id")
	private Guide guide;

	@Builder
	public Shortform(String videoUrl, User user, Guide guide){
		this.videoUrl = videoUrl;
		this.user = user;
		this.guide = guide;
	}
}
