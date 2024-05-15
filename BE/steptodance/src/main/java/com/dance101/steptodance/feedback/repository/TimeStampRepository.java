package com.dance101.steptodance.feedback.repository;

import com.dance101.steptodance.feedback.domain.Feedback;
import com.dance101.steptodance.feedback.domain.Timestamp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeStampRepository extends JpaRepository<Timestamp, Long> {
	void deleteAllByfeedback(Feedback feedback);
}
