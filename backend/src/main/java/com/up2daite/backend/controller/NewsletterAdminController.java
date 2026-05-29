package com.up2daite.backend.controller;

import com.up2daite.backend.dto.SendNewsletterRequest;
import com.up2daite.backend.dto.SubscriberAdminDto;
import com.up2daite.backend.repository.SubscriberRepository;
import com.up2daite.backend.service.NewsletterSendService;
import com.up2daite.backend.service.NewsletterSendService.SendResult;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class NewsletterAdminController {

    private final SubscriberRepository subscriberRepository;
    private final NewsletterSendService sendService;

    public NewsletterAdminController(SubscriberRepository subscriberRepository,
                                     NewsletterSendService sendService) {
        this.subscriberRepository = subscriberRepository;
        this.sendService = sendService;
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<SubscriberAdminDto>> listSubscribers() {
        List<SubscriberAdminDto> result = subscriberRepository.findAllByConfirmedTrueAndUnsubscribedAtIsNull()
                .stream()
                .map(s -> new SubscriberAdminDto(s.getId(), s.getEmail(), s.getSubscribedAt(), s.getConfirmedAt()))
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/newsletter/send")
    public ResponseEntity<SendResult> send(@Valid @RequestBody SendNewsletterRequest request) {
        try {
            SendResult result = sendService.sendEdition(request.editionId());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
