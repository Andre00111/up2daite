package com.up2daite.backend.repository;

import com.up2daite.backend.entity.EditionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EditionRepository extends JpaRepository<EditionEntity, String> {

    Optional<EditionEntity> findBySlug(String slug);

    List<EditionEntity> findByStatusOrderByNumberDesc(String status);
}
