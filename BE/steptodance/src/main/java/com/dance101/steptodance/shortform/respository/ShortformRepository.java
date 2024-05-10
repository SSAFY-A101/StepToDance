package com.dance101.steptodance.shortform.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dance101.steptodance.shortform.domain.Shortform;

public interface ShortformRepository extends JpaRepository<Shortform, Long>, ShortformRepositoryCustom {
}
