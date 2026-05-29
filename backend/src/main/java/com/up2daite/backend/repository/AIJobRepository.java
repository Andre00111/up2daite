package com.up2daite.backend.repository;

import com.up2daite.backend.entity.AIJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AIJobRepository extends JpaRepository<AIJobEntity, UUID> {
    List<AIJobEntity> findAllByOrderBySortOrderAsc();
}
