package com.up2daite.backend.repository;

import com.up2daite.backend.entity.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoryRepository extends JpaRepository<StoryEntity, String> {

    List<StoryEntity> findByEditionId(String editionId);

    List<StoryEntity> findByEditionIsNull();

    @Query("SELECT s FROM StoryEntity s WHERE " +
           "(:minImpact IS NULL OR s.signalScore.impact >= :minImpact) AND " +
           "(:maxHype IS NULL OR s.signalScore.hypeLevel <= :maxHype) AND " +
           "(:minSourceQuality IS NULL OR s.signalScore.sourceQuality >= :minSourceQuality) AND " +
           "(:buzzword IS NULL OR s.buzzwords LIKE CONCAT('%', :buzzword, '%'))")
    List<StoryEntity> findFiltered(
            @Param("minImpact") Integer minImpact,
            @Param("maxHype") Integer maxHype,
            @Param("minSourceQuality") Integer minSourceQuality,
            @Param("buzzword") String buzzword
    );
}
