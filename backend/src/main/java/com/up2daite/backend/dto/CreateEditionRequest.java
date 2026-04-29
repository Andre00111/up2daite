package com.up2daite.backend.dto;

import java.time.LocalDate;

public record CreateEditionRequest(
        String id,
        String slug,
        Integer number,
        String title,
        LocalDate publishedAt,
        String editorNote
) {}
