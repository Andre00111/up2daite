package com.todoapp.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTodoRequest(
    @NotBlank(message = "Titel darf nicht leer sein")
    String title,
    String description
) {}
