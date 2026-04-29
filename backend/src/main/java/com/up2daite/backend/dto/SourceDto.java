package com.up2daite.backend.dto;

import com.up2daite.backend.entity.Source;

public record SourceDto(String name, String url, String type) {

    public static SourceDto from(Source s) {
        return new SourceDto(s.getName(), s.getUrl(), s.getType());
    }
}
