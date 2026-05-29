package com.up2daite.backend.service;

import com.up2daite.backend.dto.CreateStoryRequest;
import com.up2daite.backend.dto.StoryDto;
import com.up2daite.backend.dto.UpdateStoryRequest;
import com.up2daite.backend.entity.*;
import com.up2daite.backend.repository.EditionRepository;
import com.up2daite.backend.repository.StoryRepository;
import com.up2daite.backend.repository.TopicRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final EditionRepository editionRepository;
    private final TopicRepository topicRepository;

    public List<StoryDto> findAll() {
        return storyRepository.findAll().stream()
                .map(StoryDto::from)
                .toList();
    }

    public List<StoryDto> findByEditionId(String editionId) {
        return storyRepository.findByEditionId(editionId).stream()
                .map(StoryDto::from)
                .toList();
    }

    public List<StoryDto> findUnassigned() {
        return storyRepository.findByEditionIsNull().stream()
                .map(StoryDto::from)
                .toList();
    }

    @Transactional
    public StoryDto create(CreateStoryRequest req) {
        StoryEntity story = new StoryEntity();
        story.setId(req.id() != null && !req.id().isBlank() ? req.id() : UUID.randomUUID().toString());
        story.setTitle(req.title());
        story.setEditorialComment(req.editorialComment());
        story.setPublishedAt(req.publishedAt() != null ? req.publishedAt() : LocalDate.now());

        story.setSource(toSource(req.source()));
        story.setSignalScore(toScore(req.signalScore()));

        if (req.editionId() != null) {
            editionRepository.findById(req.editionId()).ifPresent(story::setEdition);
        }

        story.setTopics(topicRepository.findAllById(req.topicIds() != null ? req.topicIds() : List.of()));

        return StoryDto.from(storyRepository.save(story));
    }

    @Transactional
    public StoryDto update(String id, UpdateStoryRequest req) {
        StoryEntity story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story " + id + " nicht gefunden"));

        story.setTitle(req.title());
        story.setEditorialComment(req.editorialComment());
        story.setPublishedAt(req.publishedAt());
        story.setSource(toSource(req.source()));
        story.setSignalScore(toScore(req.signalScore()));

        if (req.editionId() == null) {
            story.setEdition(null);
        } else {
            editionRepository.findById(req.editionId()).ifPresent(story::setEdition);
        }

        story.setTopics(topicRepository.findAllById(req.topicIds() != null ? req.topicIds() : List.of()));

        return StoryDto.from(storyRepository.save(story));
    }

    @Transactional
    public void delete(String id) {
        StoryEntity story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story " + id + " nicht gefunden"));
        // Vor dem Löschen Edition-Referenz lösen, falls vorhanden
        if (story.getEdition() != null) {
            story.getEdition().getStories().remove(story);
            story.setEdition(null);
        }
        storyRepository.delete(story);
    }

    private static Source toSource(com.up2daite.backend.dto.SourceDto dto) {
        Source s = new Source();
        s.setName(dto.name());
        s.setUrl(dto.url());
        s.setType(dto.type());
        return s;
    }

    private static SignalScore toScore(com.up2daite.backend.dto.SignalScoreDto dto) {
        SignalScore s = new SignalScore();
        s.setImpact(dto.impact());
        s.setHypeLevel(dto.hypeLevel());
        s.setSourceQuality(dto.sourceQuality());
        return s;
    }
}
