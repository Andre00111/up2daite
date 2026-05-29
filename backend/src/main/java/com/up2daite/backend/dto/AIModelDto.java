package com.up2daite.backend.dto;

import com.up2daite.backend.entity.AIModelEntity;

import java.util.List;
import java.util.UUID;

public record AIModelDto(
        UUID id,
        String name,
        String company,
        String logo,
        String gradient,
        String accentColor,
        Integer rank,
        String category,
        List<String> highlights,
        Integer releaseYear
) {
    public static AIModelDto from(AIModelEntity e) {
        return new AIModelDto(
                e.getId(),
                e.getName(),
                e.getCompany(),
                e.getLogo(),
                e.getGradient(),
                e.getAccentColor(),
                e.getRank(),
                e.getCategory(),
                e.getHighlights(),
                e.getReleaseYear()
        );
    }
}
