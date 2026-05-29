package com.up2daite.backend.service;

import com.up2daite.backend.dto.CreateEditionRequest;
import com.up2daite.backend.dto.EditionDto;
import com.up2daite.backend.dto.UpdateEditionRequest;
import com.up2daite.backend.entity.EditionEntity;
import com.up2daite.backend.entity.StoryEntity;
import com.up2daite.backend.repository.EditionRepository;
import com.up2daite.backend.repository.StoryRepository;
import com.up2daite.backend.util.SlugUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EditionService {

    private final EditionRepository editionRepository;
    private final StoryRepository storyRepository;

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
        edition.setId(req.id() != null && !req.id().isBlank() ? req.id() : UUID.randomUUID().toString());
        edition.setTitle(req.title());
        edition.setEditorNote(req.editorNote());
        edition.setPublishedAt(req.publishedAt() != null ? req.publishedAt() : LocalDate.now());
        edition.setNumber(req.number() != null ? req.number() : editionRepository.findMaxNumber() + 1);
        edition.setSlug(uniqueSlug(req.slug(), req.title()));
        edition.setStatus("draft");

        EditionEntity saved = editionRepository.save(edition);
        if (req.storyIds() != null && !req.storyIds().isEmpty()) {
            attachStoriesInOrder(saved, req.storyIds());
        }
        return EditionDto.from(saved);
    }

    @Transactional
    public EditionDto update(String id, UpdateEditionRequest req) {
        EditionEntity edition = editionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Edition " + id + " nicht gefunden"));

        edition.setTitle(req.title());
        edition.setEditorNote(req.editorNote());
        if (req.publishedAt() != null) {
            edition.setPublishedAt(req.publishedAt());
        }

        attachStoriesInOrder(edition, req.storyIds() != null ? req.storyIds() : List.of());

        return EditionDto.from(edition);
    }

    @Transactional
    public void delete(String id) {
        EditionEntity edition = editionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Edition " + id + " nicht gefunden"));
        // Stories werden NICHT mitgelöscht, sondern verlieren ihre Edition-Zuordnung (Safety).
        for (StoryEntity story : new ArrayList<>(edition.getStories())) {
            story.setEdition(null);
        }
        edition.getStories().clear();
        editionRepository.delete(edition);
    }

    @Transactional
    public EditionDto publish(String id) {
        EditionEntity edition = editionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Edition " + id + " nicht gefunden"));
        edition.setStatus("published");
        edition.setPublishedAt(LocalDate.now());
        return EditionDto.from(edition);
    }

    @Transactional
    public EditionDto unpublish(String id) {
        EditionEntity edition = editionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Edition " + id + " nicht gefunden"));
        edition.setStatus("draft");
        return EditionDto.from(edition);
    }

    private String uniqueSlug(String requested, String title) {
        String base = (requested != null && !requested.isBlank())
                ? SlugUtil.slugify(requested)
                : SlugUtil.slugify(title);
        if (base.isBlank()) base = "edition";
        String candidate = base;
        int counter = 2;
        while (editionRepository.existsBySlug(candidate)) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }

    /**
     * Ordnet die übergebenen Stories der Edition in genau dieser Reihenfolge zu.
     * Stories, die vorher zur Edition gehörten und jetzt nicht mehr in der Liste sind,
     * werden detached (edition_id = null).
     */
    private void attachStoriesInOrder(EditionEntity edition, List<String> newStoryIds) {
        // 1. Stories die rausfliegen sollen detachen
        List<StoryEntity> current = new ArrayList<>(edition.getStories());
        for (StoryEntity story : current) {
            if (!newStoryIds.contains(story.getId())) {
                story.setEdition(null);
            }
        }
        edition.getStories().clear();

        // 2. Neue Reihenfolge aufbauen
        for (String storyId : newStoryIds) {
            StoryEntity story = storyRepository.findById(storyId)
                    .orElseThrow(() -> new EntityNotFoundException("Story " + storyId + " nicht gefunden"));
            story.setEdition(edition);
            edition.getStories().add(story);
        }
    }
}
