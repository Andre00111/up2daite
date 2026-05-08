package com.todoapp.backend.dto;

public record UpdateTodoRequest(
    String title,
    String description,
    Boolean completed
) {}
