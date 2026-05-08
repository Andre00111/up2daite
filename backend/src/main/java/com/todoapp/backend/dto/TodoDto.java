package com.todoapp.backend.dto;

import java.time.LocalDateTime;

public record TodoDto(
    Long id,
    String title,
    String description,
    boolean completed,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
