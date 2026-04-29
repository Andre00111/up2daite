package com.up2daite.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateStoryRequest(
        String id,
        String title,
        String editorialComment,
        SourceDto source,
        SignalScoreDto signalScore,
        List<String> topicIds,
        LocalDate publishedAt,
        String editionId        // optional — null wenn noch keiner Ausgabe zugeordnet
) {}
