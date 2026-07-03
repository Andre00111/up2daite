package com.up2daite.backend.entity;

import com.up2daite.backend.util.StringListConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stories")
@Getter @Setter
public class StoryEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "editorial_comment", columnDefinition = "TEXT")
    private String editorialComment;

    // Source und SignalScore werden direkt in diese Tabelle eingebettet (@Embeddable)
    @Embedded
    private Source source;

    @Embedded
    private SignalScore signalScore;

    @Column(name = "published_at")
    private LocalDate publishedAt;

    // Viele Stories gehören zu einer Edition (nullable = Story ohne Ausgabe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "edition_id")
    private EditionEntity edition;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private List<String> buzzwords = new ArrayList<>();

    // Many-to-Many mit Topics über Join-Tabelle story_topics
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "story_topics",
        joinColumns = @JoinColumn(name = "story_id"),
        inverseJoinColumns = @JoinColumn(name = "topic_id")
    )
    private List<TopicEntity> topics = new ArrayList<>();
}
