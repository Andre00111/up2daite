package com.up2daite.backend.dto;

import java.util.List;

public record AIJobWriteRequest(
        String title,
        String category,
        Integer riskScore,
        String trend,
        String reasoning,
        List<String> affectedTasks,
        Integer sortOrder    // optional, default = MAX+1
) {}
