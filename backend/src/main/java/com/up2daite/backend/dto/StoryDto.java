package com.up2daite.backend.dto;

import com.up2daite.backend.entity.StoryEntity;

import java.time.LocalDate;
import java.util.List;

public record StoryDto(
        String id,
        String title,
        String editorialComment,
        SourceDto source,
        SignalScoreDto signalScore,
        List<String> topics,   // topic-IDs wie "ai-research"
        List<String> buzzwords,
        LocalDate publishedAt,
        String editionId
) {
    public static StoryDto from(StoryEntity e) {
        return new StoryDto(
                e.getId(),
                e.getTitle(),
                e.getEditorialComment(),
                SourceDto.from(e.getSource()),
                SignalScoreDto.from(e.getSignalScore()),
                e.getTopics().stream().map(t -> t.getId()).toList(),
                e.getBuzzwords(),
                e.getPublishedAt(),
                e.getEdition() != null ? e.getEdition().getId() : null
        );
    }
}
