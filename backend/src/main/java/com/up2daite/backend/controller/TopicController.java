package com.up2daite.backend.controller;

import com.up2daite.backend.dto.TopicDto;
import com.up2daite.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicRepository topicRepository;

    @GetMapping
    public List<TopicDto> findAll() {
        return topicRepository.findAll().stream()
                .map(TopicDto::from)
                .toList();
    }
}
