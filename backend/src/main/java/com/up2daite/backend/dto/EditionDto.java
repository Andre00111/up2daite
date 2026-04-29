package com.up2daite.backend.dto;

import com.up2daite.backend.entity.EditionEntity;

import java.time.LocalDate;
import java.util.List;

public record EditionDto(
        String id,
        String slug,
        Integer number,
        String title,
        LocalDate publishedAt,
        String status,
        String editorNote,
        List<String> storyIds   // IDs in redaktioneller Reihenfolge
) {
    public static EditionDto from(EditionEntity e) {
        return new EditionDto(
                e.getId(),
                e.getSlug(),
                e.getNumber(),
                e.getTitle(),
                e.getPublishedAt(),
                e.getStatus(),
                e.getEditorNote(),
                e.getStories().stream().map(s -> s.getId()).toList()
        );
    }
}
