package com.up2daite.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

// @Embeddable: kein eigener Tisch — Felder werden direkt in die Story-Tabelle eingebettet
@Embeddable
@Getter @Setter
public class Source {

    @Column(name = "source_name", length = 200)
    private String name;

    @Column(name = "source_url", length = 500)
    private String url;

    @Column(name = "source_type", length = 20)
    private String type; // "primary" | "analysis" | "pr-driven"
}
