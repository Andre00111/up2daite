package com.up2daite.backend.controller;

import com.up2daite.backend.dto.AIJobDto;
import com.up2daite.backend.dto.AIJobWriteRequest;
import com.up2daite.backend.service.AIJobService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai-jobs")
@RequiredArgsConstructor
public class AIJobController {

    private final AIJobService service;

    @GetMapping
    public List<AIJobDto> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AIJobDto create(@RequestBody AIJobWriteRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AIJobDto> update(@PathVariable UUID id, @RequestBody AIJobWriteRequest request) {
        try {
            return ResponseEntity.ok(service.update(id, request));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
