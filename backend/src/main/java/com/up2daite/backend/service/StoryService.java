package com.up2daite.backend.service;

import com.up2daite.backend.dto.CreateStoryRequest;
import com.up2daite.backend.dto.StoryDto;
import com.up2daite.backend.entity.*;
import com.up2daite.backend.repository.EditionRepository;
import com.up2daite.backend.repository.StoryRepository;
import com.up2daite.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        story.setId(req.id());
        story.setTitle(req.title());
        story.setEditorialComment(req.editorialComment());
        story.setPublishedAt(req.publishedAt());

        Source source = new Source();
        source.setName(req.source().name());
        source.setUrl(req.source().url());
        source.setType(req.source().type());
        story.setSource(source);

        SignalScore score = new SignalScore();
        score.setImpact(req.signalScore().impact());
        score.setHypeLevel(req.signalScore().hypeLevel());
        score.setSourceQuality(req.signalScore().sourceQuality());
        story.setSignalScore(score);

        if (req.editionId() != null) {
            editionRepository.findById(req.editionId())
                    .ifPresent(story::setEdition);
        }

        List<TopicEntity> topics = topicRepository.findAllById(req.topicIds());
        story.setTopics(topics);

        return StoryDto.from(storyRepository.save(story));
    }
}
