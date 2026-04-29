package com.up2daite.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "editions")
@Getter @Setter
public class EditionEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(unique = true, nullable = false, length = 200)
    private String slug;

    @Column(nullable = false)
    private Integer number;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "published_at")
    private LocalDate publishedAt;

    // "draft" oder "published"
    @Column(nullable = false, length = 20)
    private String status = "draft";

    @Column(name = "editor_note", columnDefinition = "TEXT")
    private String editorNote;

    // Bidirektionale Beziehung: Edition hat viele Stories
    // mappedBy = "edition" verweist auf das Feld in StoryEntity
    @OneToMany(mappedBy = "edition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderColumn(name = "edition_order") // erhält redaktionelle Reihenfolge
    private List<StoryEntity> stories = new ArrayList<>();
}
