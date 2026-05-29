package com.up2daite.backend.repository;

import com.up2daite.backend.entity.AIModelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AIModelRepository extends JpaRepository<AIModelEntity, UUID> {
    List<AIModelEntity> findAllByOrderByRankAsc();
}
