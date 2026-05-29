package com.up2daite.backend.controller;

import com.up2daite.backend.dto.AIModelDto;
import com.up2daite.backend.dto.AIModelWriteRequest;
import com.up2daite.backend.service.AIModelService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai-models")
@RequiredArgsConstructor
public class AIModelController {

    private final AIModelService service;

    @GetMapping
    public List<AIModelDto> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AIModelDto create(@RequestBody AIModelWriteRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AIModelDto> update(@PathVariable UUID id, @RequestBody AIModelWriteRequest request) {
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
