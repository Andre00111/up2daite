package com.up2daite.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "topics")
@Getter @Setter
public class TopicEntity {

    // id ist ein fester String-Wert wie "ai-research" — kein generierter Key
    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String label;
}
