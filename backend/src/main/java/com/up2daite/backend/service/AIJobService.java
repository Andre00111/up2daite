package com.up2daite.backend.service;

import com.up2daite.backend.dto.AIJobDto;
import com.up2daite.backend.dto.AIJobWriteRequest;
import com.up2daite.backend.entity.AIJobEntity;
import com.up2daite.backend.repository.AIJobRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AIJobService {

    private final AIJobRepository repository;

    public List<AIJobDto> findAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(AIJobDto::from)
                .toList();
    }

    @Transactional
    public AIJobDto create(AIJobWriteRequest req) {
        int nextOrder = req.sortOrder() != null
                ? req.sortOrder()
                : repository.findAll().stream().mapToInt(AIJobEntity::getSortOrder).max().orElse(0) + 1;

        AIJobEntity job = AIJobEntity.builder()
                .id(UUID.randomUUID())
                .title(req.title())
                .category(req.category())
                .riskScore(req.riskScore())
                .trend(req.trend())
                .reasoning(req.reasoning())
                .affectedTasks(req.affectedTasks() != null ? req.affectedTasks() : List.of())
                .sortOrder(nextOrder)
                .build();
        return AIJobDto.from(repository.save(job));
    }

    @Transactional
    public AIJobDto update(UUID id, AIJobWriteRequest req) {
        AIJobEntity job = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AI-Job " + id + " nicht gefunden"));
        job.setTitle(req.title());
        job.setCategory(req.category());
        job.setRiskScore(req.riskScore());
        job.setTrend(req.trend());
        job.setReasoning(req.reasoning());
        job.setAffectedTasks(req.affectedTasks() != null ? req.affectedTasks() : List.of());
        if (req.sortOrder() != null) job.setSortOrder(req.sortOrder());
        return AIJobDto.from(job);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("AI-Job " + id + " nicht gefunden");
        }
        repository.deleteById(id);
    }
}
