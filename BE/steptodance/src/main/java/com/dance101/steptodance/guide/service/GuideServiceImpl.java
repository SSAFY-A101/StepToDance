package com.dance101.steptodance.guide.service;

import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.feedback.domain.Feedback;
import com.dance101.steptodance.feedback.repository.FeedbackRepository;
import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.global.utils.FFmpegUtils;
import com.dance101.steptodance.guide.data.request.FeedbackMessageRequest;
import com.dance101.steptodance.guide.data.request.GuideFeedbackCreateRequest;
import com.dance101.steptodance.guide.data.request.GuideUploadMultipartRequest;
import com.dance101.steptodance.guide.data.request.SearchConditions;
import com.dance101.steptodance.guide.data.response.FeedbackResponse;
import com.dance101.steptodance.guide.data.response.GuideFindResponse;
import com.dance101.steptodance.guide.data.response.GuideListFindResponse;
import com.dance101.steptodance.guide.domain.Genre;
import com.dance101.steptodance.guide.domain.Guide;
import com.dance101.steptodance.guide.repository.GenreRepository;
import com.dance101.steptodance.guide.repository.GuideRepository;
import com.dance101.steptodance.infra.S3Service;
import com.dance101.steptodance.user.domain.User;
import com.dance101.steptodance.user.repository.UserRepository;
import com.dance101.steptodance.user.utils.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;
import static com.dance101.steptodance.global.exception.data.response.ErrorCode.GUIDE_NOT_FOUND;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class GuideServiceImpl implements GuideService{
	private final GuideRepository guideRepository;
	private final GenreRepository genreRepository;
	private final AIServerService aiServerService;
	private final UserRepository userRepository;
	private final FeedbackRepository feedbackRepository;
	private final FFmpegUtils ffmpegUtils;
	private final S3Service s3Service;
	// private final String AIServer_URL = "https://steptodance.site:8000";
	private final String AIServer_URL = "http://k10a101.p.ssafy.io:8000";

	@Override
	public GuideListFindResponse findGuideList(SearchConditions searchConditions, long userId) {
		// get response
		List<GuideFindResponse> guideFindResponses = guideRepository.findGuideListWithSearchConditions(searchConditions, userId);

		// create response & return
		return GuideListFindResponse.builder()
			.guideList(guideFindResponses)
			.build();
	}

	@Override
	public GuideListFindResponse findHotGuideList() {
		// get response
		List<GuideFindResponse> guideFindResponses = guideRepository.findHotGuideList();

		// create response & return
		return GuideListFindResponse.builder()
			.guideList(guideFindResponses)
			.build();
	}

	@Transactional
	@Override
	public void guideUploadFile(long userId, GuideUploadMultipartRequest request) {
		log.info("GuideServiceImpl:guideUploadFile : request = " + request.toString());
		Genre genre = genreRepository.findById(request.getGenre_id())
			.orElseThrow(() -> new NotFoundException("GuideServiceImpl:guideUploadFile : genreId=" + request.getGenre_id(), GENRE_NOT_FOUND));
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new NotFoundException("GuideServiceImpl:guideUploadFile : userId=" + userId, UNDEFINED_USER));
		Guide guide = Guide.builder()
			.genre(genre)
			.singer(request.getSinger())
			.songTitle(request.getSong_title())
			.highlightSectionStartAt(request.getHighlight_section_start_at())
			.highlightSectionEndAt(request.getHighlight_section_end_at())
			.user(user)
			.build();
		guideRepository.save(guide);
		try {
			// kafka를 통해 비디오 프레임 전송
			MultipartFile thumbnail = ffmpegUtils.sendVodToKafka(guide.getId(), "guide", request.getVideo());
			// 영상 업로드
			String url = s3Service.upload(
				request.getVideo(),
				"guide/" + guide.getId() + "." + StringUtils.getFilenameExtension(request.getVideo().getOriginalFilename()));
			guide.addUrl(url);
			// 썸네일 업로드
			url = s3Service.upload(
				thumbnail, "guide/thumbnail/" + guide.getId() + "." + StringUtils.getFilenameExtension(thumbnail.getOriginalFilename()));
			guide.addThumbnail(url);
		} catch (Exception e) {
			guideRepository.delete(guide);
			throw new ExternalServerException("GuideServiceImpl:guidUpload", GUIDE_UPLOAD_FAILED);
		}

	}

	@Override
	public GuideFindResponse findGuide(long guideId) {
		// get guide response & return
		return guideRepository.findGuideByGuideId(guideId)
			.orElseThrow(() -> new NotFoundException("GuideServiceImpl:findGuide", GUIDE_NOT_FOUND));
	}

	@Transactional
	@Override
	public FeedbackResponse createGuideFeedback(long userId, long guideId, GuideFeedbackCreateRequest request) {
		log.info("GuideServiceImpl:guideUploadFile : request = " + request.toString());
		// find guide & user
		Guide guide = guideRepository.findById(guideId)
			.orElseThrow(() -> new NotFoundException("GuideServiceImpl:createGuideFeedback", GUIDE_NOT_FOUND));
		User user = UserUtils.findUserById(userRepository, userId);

		// create & save feedback
		Feedback feedback = Feedback.builder()
			.videoUrl(null)
			.score(0.0)
			.thumbnailImgUrl(null)
			.guide(guide)
			.user(user)
			.build();
		Feedback savedFeedback = feedbackRepository.save(feedback);

		try {
			// kafka를 통해 비디오 프레임 전송
			MultipartFile thumbnail = ffmpegUtils.sendVodToKafka(savedFeedback.getId(), "feedback", request.getVideo());
			// 영상 업로드
			String url = s3Service.upload(
				request.getVideo(),
				"feedback/" + savedFeedback.getId() + "." + StringUtils.getFilenameExtension(request.getVideo().getOriginalFilename()));
			feedback.addUrl(url);
			// 썸네일 업로드
			url = s3Service.upload(
				thumbnail, "feedback/thumbnail/" + savedFeedback.getId() + "." + StringUtils.getFilenameExtension(thumbnail.getOriginalFilename()));
			feedback.addThumbnailUrl(url);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		// create & return
		return new FeedbackResponse(savedFeedback.getId());
	}
	@Async
	@Transactional
	@Override
	public CompletableFuture<FeedbackResponse> createGuideFeedbackBackUp(long userId, long guideId,
		GuideFeedbackCreateRequest guideFeedbackCreateRequest) {
		// find guide & user
		Guide guide = guideRepository.findById(guideId)
			.orElseThrow(() -> new NotFoundException("GuideServiceImpl:createGuideFeedback", GUIDE_NOT_FOUND));
		User user = UserUtils.findUserById(userRepository, userId);

		// create & save feedback
		Feedback feedback = Feedback.builder()
			// .videoUrl(guideFeedbackCreateRequest.videoUrl())
			.videoUrl(null)
			.score(0.0)
			.thumbnailImgUrl(null)
			.guide(guide)
			.user(user)
			.build();
		Feedback savedFeedback = feedbackRepository.save(feedback);

		// create message & send to ai server
		FeedbackMessageRequest feedbackMessageRequest = FeedbackMessageRequest.builder()
			.id(savedFeedback.getId())
			.startAt(null)
			.endAt(null)
			.videoUrl(null)
			// .startAt(guideFeedbackCreateRequest.startAt())
			// .endAt(guideFeedbackCreateRequest.endAt())
			// .videoUrl(guideFeedbackCreateRequest.videoUrl())
			.guideUrl(guide.getVideoUrl())
			.highlightSectionStartAt(guide.getHighlightSectionStartAt())
			.highlightSectionEndAt(guide.getHighlightSectionEndAt())
			.build();
		aiServerService.publish(feedbackMessageRequest);

		// create & return
		return CompletableFuture.completedFuture(new FeedbackResponse(savedFeedback.getId()));
	}
}
