package com.up2daite.backend.dto;

import java.time.Instant;

public record SubscriberAdminDto(
        String id,
        String email,
        Instant subscribedAt,
        Instant confirmedAt
) {}
