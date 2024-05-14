package com.dance101.steptodance.shortform.service;

import static com.dance101.steptodance.global.exception.data.response.ErrorCode.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dance101.steptodance.global.exception.category.ExternalServerException;
import com.dance101.steptodance.global.exception.category.NotFoundException;
import com.dance101.steptodance.global.utils.FFmpegUtils;
import com.dance101.steptodance.guide.domain.Guide;
import com.dance101.steptodance.guide.repository.GuideRepository;
import com.dance101.steptodance.infra.S3Service;
import com.dance101.steptodance.shortform.data.request.ShortformUploadMultipartRequest;
import com.dance101.steptodance.shortform.data.response.ShortformFindResponse;
import com.dance101.steptodance.shortform.domain.Shortform;
import com.dance101.steptodance.shortform.respository.ShortformRepository;
import com.dance101.steptodance.user.domain.User;
import com.dance101.steptodance.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ShortformServiceImpl implements ShortformService {
	private final GuideRepository guideRepository;
	private final ShortformRepository shortformRepository;
	private final UserRepository userRepository;
	private final S3Service s3Service;
	private final FFmpegUtils fFmpegUtils;

	@Transactional
	@Override
	public Long shortformUploadFile(long userId, ShortformUploadMultipartRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(()->new NotFoundException("ShortformServiceImpl:shortformUploadFile", UNDEFINED_USER));
		Guide guide = guideRepository.findById(request.getGuide_id())
			.orElseThrow(()-> new NotFoundException("ShortformServiceImpl:shortformUploadFile", GUIDE_NOT_FOUND));
		Shortform shortform = Shortform.builder()
			.guide(guide)
			.user(user)
			.build();

		shortformRepository.save(shortform);

		try {
			// 숏폼 편집
			MultipartFile video = fFmpegUtils.editVideo(request.getVideo(), request.getStartAt(), request.getEndAt());
			// 영상 업로드
			String url = s3Service.upload(
				video,
				"shortform/" + shortform.getId() + "." + StringUtils.getFilenameExtension(request.getVideo().getOriginalFilename()));
			shortform.addUrl(url);
			return shortform.getId();
		} catch (Exception e) {
			throw new ExternalServerException("ShortformServiceImpl:shortformUploadFile", SHORTFORM_UPLOAD_FAILED);
		}
	}

	@Override
	public ShortformFindResponse findShortform(long shortformId) {
		ShortformFindResponse shortformFindResponse = shortformRepository.findShortformById(shortformId)
			.orElseThrow(()->new NotFoundException("ShortformServiceImpl:findShortform", SHORTFORM_NOT_FOUND));

		return shortformFindResponse;
	}

	@Override
	public List<ShortformFindResponse> findShortformList(int count) {
		List<ShortformFindResponse> shortformFindResponses = shortformRepository.findShortformList(count);
		
		return shortformFindResponses;
	}

	@Transactional
	@Override
	public void deleteShortForm(long shortformId) {
		Shortform shortform = shortformRepository.findById(shortformId)
			.orElseThrow(()->new NotFoundException("ShortformServiceImpl:deleteShortform", SHORTFORM_NOT_FOUND));

		shortformRepository.delete(shortform);
	}
}
