package com.up2daite.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record SendNewsletterRequest(
        @NotBlank String editionId
) {}
