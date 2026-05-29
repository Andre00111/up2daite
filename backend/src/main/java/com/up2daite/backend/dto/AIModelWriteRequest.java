package com.up2daite.backend.dto;

import java.util.List;

public record AIModelWriteRequest(
        String name,
        String company,
        String logo,
        String gradient,
        String accentColor,
        Integer rank,
        String category,
        List<String> highlights,
        Integer releaseYear
) {}
