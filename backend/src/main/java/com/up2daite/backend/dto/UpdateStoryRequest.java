package com.up2daite.backend.dto;

import java.time.LocalDate;
import java.util.List;

/** Vollständiges Update einer Story. Alle Felder werden ersetzt. */
public record UpdateStoryRequest(
        String title,
        String editorialComment,
        SourceDto source,
        SignalScoreDto signalScore,
        List<String> topicIds,
        List<String> buzzwords,
        LocalDate publishedAt,
        String editionId        // optional — null = unassigned
) {}
