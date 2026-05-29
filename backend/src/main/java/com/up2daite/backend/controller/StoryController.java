package com.up2daite.backend.controller;

import com.up2daite.backend.dto.CreateStoryRequest;
import com.up2daite.backend.dto.StoryDto;
import com.up2daite.backend.dto.UpdateStoryRequest;
import com.up2daite.backend.service.StoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    // GET /api/stories               → alle Stories
    // GET /api/stories?editionId=x   → Stories einer Ausgabe
    // GET /api/stories?unassigned=true → Stories ohne Ausgabe (für Admin)
    @GetMapping
    public List<StoryDto> findAll(
            @RequestParam(required = false) String editionId,
            @RequestParam(required = false) boolean unassigned) {

        if (editionId != null) {
            return storyService.findByEditionId(editionId);
        }
        if (unassigned) {
            return storyService.findUnassigned();
        }
        return storyService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoryDto create(@RequestBody CreateStoryRequest request) {
        return storyService.create(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDto> update(@PathVariable String id, @RequestBody UpdateStoryRequest request) {
        try {
            return ResponseEntity.ok(storyService.update(id, request));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            storyService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
