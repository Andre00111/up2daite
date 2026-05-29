package com.up2daite.backend.entity;

import com.up2daite.backend.util.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ai_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIModelEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(length = 10)
    private String logo;

    @Column(length = 200)
    private String gradient;

    @Column(name = "accent_color", length = 20)
    private String accentColor;

    /** "rank" ist in PostgreSQL ein reserviertes Window-Function-Wort → Spalte heißt "rank_pos". */
    @Column(name = "rank_pos", nullable = false)
    private Integer rank;

    @Column(length = 100)
    private String category;

    @Convert(converter = StringListConverter.class)
    @Column(nullable = false, columnDefinition = "TEXT")
    private List<String> highlights;

    @Column(name = "release_year")
    private Integer releaseYear;
}
