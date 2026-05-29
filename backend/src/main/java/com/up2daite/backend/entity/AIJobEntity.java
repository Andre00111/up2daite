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
@Table(name = "ai_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIJobEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(nullable = false, length = 20)
    private String trend; // "rising" | "stable" | "declining"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reasoning;

    @Convert(converter = StringListConverter.class)
    @Column(name = "affected_tasks", nullable = false, columnDefinition = "TEXT")
    private List<String> affectedTasks;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
