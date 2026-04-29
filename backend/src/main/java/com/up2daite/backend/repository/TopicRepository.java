package com.up2daite.backend.repository;

import com.up2daite.backend.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<TopicEntity, String> {
}
