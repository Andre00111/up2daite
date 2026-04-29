package com.up2daite.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter @Setter
public class SignalScore {

    @Column(name = "signal_impact")
    private Integer impact;

    @Column(name = "signal_hype_level")
    private Integer hypeLevel;

    @Column(name = "signal_source_quality")
    private Integer sourceQuality;
}
