package com.up2daite.backend.dto;

import com.up2daite.backend.entity.SignalScore;

public record SignalScoreDto(Integer impact, Integer hypeLevel, Integer sourceQuality) {

    public static SignalScoreDto from(SignalScore s) {
        return new SignalScoreDto(s.getImpact(), s.getHypeLevel(), s.getSourceQuality());
    }
}
