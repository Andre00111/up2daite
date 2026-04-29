package com.up2daite.backend.service;

import com.up2daite.backend.dto.CreateEditionRequest;
import com.up2daite.backend.dto.EditionDto;
import com.up2daite.backend.entity.EditionEntity;
import com.up2daite.backend.repository.EditionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EditionService {

    private final EditionRepository editionRepository;

    public List<EditionDto> findAll() {
        return editionRepository.findAll().stream()
                .map(EditionDto::from)
                .toList();
    }

    public List<EditionDto> findPublished() {
        return editionRepository.findByStatusOrderByNumberDesc("published").stream()
                .map(EditionDto::from)
                .toList();
    }

    public Optional<EditionDto> findBySlug(String slug) {
        return editionRepository.findBySlug(slug).map(EditionDto::from);
    }

    @Transactional
    public EditionDto create(CreateEditionRequest req) {
        EditionEntity edition = new EditionEntity();
        edition.setId(req.id());
        edition.setSlug(req.slug());
        edition.setNumber(req.number());
        edition.setTitle(req.title());
        edition.setPublishedAt(req.publishedAt());
        edition.setEditorNote(req.editorNote());
        edition.setStatus("draft");
        return EditionDto.from(editionRepository.save(edition));
    }
}
