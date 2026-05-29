package com.up2daite.backend.service;

import com.up2daite.backend.dto.AIModelDto;
import com.up2daite.backend.dto.AIModelWriteRequest;
import com.up2daite.backend.entity.AIModelEntity;
import com.up2daite.backend.repository.AIModelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AIModelService {

    private final AIModelRepository repository;

    public List<AIModelDto> findAll() {
        return repository.findAllByOrderByRankAsc().stream()
                .map(AIModelDto::from)
                .toList();
    }

    @Transactional
    public AIModelDto create(AIModelWriteRequest req) {
        AIModelEntity model = AIModelEntity.builder()
                .id(UUID.randomUUID())
                .name(req.name())
                .company(req.company())
                .logo(req.logo())
                .gradient(req.gradient())
                .accentColor(req.accentColor())
                .rank(req.rank())
                .category(req.category())
                .highlights(req.highlights() != null ? req.highlights() : List.of())
                .releaseYear(req.releaseYear())
                .build();
        return AIModelDto.from(repository.save(model));
    }

    @Transactional
    public AIModelDto update(UUID id, AIModelWriteRequest req) {
        AIModelEntity model = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AI-Modell " + id + " nicht gefunden"));
        model.setName(req.name());
        model.setCompany(req.company());
        model.setLogo(req.logo());
        model.setGradient(req.gradient());
        model.setAccentColor(req.accentColor());
        model.setRank(req.rank());
        model.setCategory(req.category());
        model.setHighlights(req.highlights() != null ? req.highlights() : List.of());
        model.setReleaseYear(req.releaseYear());
        return AIModelDto.from(model);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("AI-Modell " + id + " nicht gefunden");
        }
        repository.deleteById(id);
    }
}
