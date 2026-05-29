package com.up2daite.backend.controller;

import com.up2daite.backend.dto.SubscribeRequest;
import com.up2daite.backend.service.SubscriberService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscribers")
public class SubscriberController {

    private final SubscriberService service;

    public SubscriberController(SubscriberService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> subscribe(@Valid @RequestBody SubscribeRequest request) {
        service.subscribe(request.email());
        // Immer 202 zurück, kein Hinweis ob Email schon existiert (Enumeration-Schutz)
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/confirm")
    public ResponseEntity<Void> confirm(@RequestParam("token") String token) {
        return service.confirm(token) ? ResponseEntity.noContent().build()
                                      : ResponseEntity.notFound().build();
    }

    @GetMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestParam("token") String token) {
        return service.unsubscribe(token) ? ResponseEntity.noContent().build()
                                          : ResponseEntity.notFound().build();
    }
}
