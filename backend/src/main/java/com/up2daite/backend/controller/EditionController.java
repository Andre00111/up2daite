package com.up2daite.backend.controller;

import com.up2daite.backend.dto.CreateEditionRequest;
import com.up2daite.backend.dto.EditionDto;
import com.up2daite.backend.service.EditionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/editions")
@RequiredArgsConstructor
public class EditionController {

    private final EditionService editionService;

    @GetMapping
    public List<EditionDto> findAll(@RequestParam(required = false) String status) {
        if ("published".equals(status)) {
            return editionService.findPublished();
        }
        return editionService.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<EditionDto> findBySlug(@PathVariable String slug) {
        return editionService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EditionDto create(@RequestBody CreateEditionRequest request) {
        return editionService.create(request);
    }
}
