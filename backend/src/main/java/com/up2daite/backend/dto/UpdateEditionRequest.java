package com.up2daite.backend.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Update einer Edition. Titel/EditorNote/StoryIds werden gesetzt.
 * Status wird hier NICHT geändert — dafür gibt es publish/unpublish-Endpoints.
 */
public record UpdateEditionRequest(
        String title,
        String editorNote,
        LocalDate publishedAt,
        List<String> storyIds   // Reihenfolge = redaktionelle Sortierung
) {}
