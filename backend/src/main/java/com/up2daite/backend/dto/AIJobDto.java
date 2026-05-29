package com.up2daite.backend.dto;

import com.up2daite.backend.entity.AIJobEntity;

import java.util.List;
import java.util.UUID;

public record AIJobDto(
        UUID id,
        String title,
        String category,
        Integer riskScore,
        String trend,
        String reasoning,
        List<String> affectedTasks,
        Integer sortOrder
) {
    public static AIJobDto from(AIJobEntity e) {
        return new AIJobDto(
                e.getId(),
                e.getTitle(),
                e.getCategory(),
                e.getRiskScore(),
                e.getTrend(),
                e.getReasoning(),
                e.getAffectedTasks(),
                e.getSortOrder()
        );
    }
}
