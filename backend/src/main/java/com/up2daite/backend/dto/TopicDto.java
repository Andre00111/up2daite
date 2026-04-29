package com.up2daite.backend.dto;

import com.up2daite.backend.entity.TopicEntity;

public record TopicDto(String id, String label) {

    public static TopicDto from(TopicEntity e) {
        return new TopicDto(e.getId(), e.getLabel());
    }
}
