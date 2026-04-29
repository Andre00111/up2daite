package com.up2daite.backend.repository;

import com.up2daite.backend.entity.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoryRepository extends JpaRepository<StoryEntity, String> {

    List<StoryEntity> findByEditionId(String editionId);

    List<StoryEntity> findByEditionIsNull();
}
