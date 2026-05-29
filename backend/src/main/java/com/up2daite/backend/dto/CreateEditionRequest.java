package com.up2daite.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateEditionRequest(
        String id,              // optional — Backend generiert UUID wenn null
        String slug,            // optional — wird aus title gebildet wenn null
        Integer number,         // optional — Backend setzt MAX(number)+1 wenn null
        String title,
        LocalDate publishedAt,
        String editorNote,
        List<String> storyIds   // optional — Stories werden zugeordnet (Reihenfolge bleibt erhalten)
) {}
