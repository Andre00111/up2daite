package com.up2daite.backend.service;

import com.up2daite.backend.entity.SubscriberEntity;
import com.up2daite.backend.repository.SubscriberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

/**
 * Verwaltet den Subscriber-Lifecycle:
 *   anmelden → Bestätigungs-Mail → bestätigen → (irgendwann abmelden)
 *
 * Wichtig: Bei Doppel-Anmeldung wird kein Fehler nach außen gegeben, sondern
 * einfach ein neuer Confirmation-Token gesetzt und die Mail erneut verschickt –
 * verhindert Email-Enumeration.
 */
@Service
public class SubscriberService {

    private static final Logger log = LoggerFactory.getLogger(SubscriberService.class);
    private static final SecureRandom RNG = new SecureRandom();

    private final SubscriberRepository repository;
    private final BrevoEmailService emailService;
    private final TemplateEngine templateEngine;
    private final String appBaseUrl;

    public SubscriberService(SubscriberRepository repository,
                             BrevoEmailService emailService,
                             TemplateEngine templateEngine,
                             @Value("${app.base-url}") String appBaseUrl) {
        this.repository = repository;
        this.emailService = emailService;
        this.templateEngine = templateEngine;
        this.appBaseUrl = appBaseUrl;
    }

    @Transactional
    public void subscribe(String email) {
        String normalized = email.trim().toLowerCase();
        Optional<SubscriberEntity> existing = repository.findByEmail(normalized);

        SubscriberEntity sub;
        if (existing.isPresent()) {
            sub = existing.get();
            // Falls schon bestätigt: keine erneute Mail (vermeidet Spam-Vektor)
            if (sub.isConfirmed() && sub.getUnsubscribedAt() == null) {
                log.info("Subscribe-Request für bereits bestätigte Email {} – nichts zu tun.", normalized);
                return;
            }
            sub.setConfirmationToken(randomToken());
            sub.setSubscribedAt(Instant.now());
            sub.setUnsubscribedAt(null);
        } else {
            sub = SubscriberEntity.builder()
                    .id(UUID.randomUUID().toString())
                    .email(normalized)
                    .subscribedAt(Instant.now())
                    .confirmed(false)
                    .confirmationToken(randomToken())
                    .build();
        }
        repository.save(sub);
        sendConfirmationMail(sub);
    }

    @Transactional
    public boolean confirm(String token) {
        Optional<SubscriberEntity> opt = repository.findByConfirmationToken(token);
        if (opt.isEmpty()) return false;
        SubscriberEntity sub = opt.get();
        sub.setConfirmed(true);
        sub.setConfirmedAt(Instant.now());
        sub.setConfirmationToken(null);
        if (sub.getUnsubscribeToken() == null) {
            sub.setUnsubscribeToken(randomToken());
        }
        repository.save(sub);
        return true;
    }

    @Transactional
    public boolean unsubscribe(String token) {
        Optional<SubscriberEntity> opt = repository.findByUnsubscribeToken(token);
        if (opt.isEmpty()) return false;
        SubscriberEntity sub = opt.get();
        sub.setUnsubscribedAt(Instant.now());
        repository.save(sub);
        return true;
    }

    private void sendConfirmationMail(SubscriberEntity sub) {
        String confirmUrl = appBaseUrl + "/confirm?token=" + sub.getConfirmationToken();
        Context ctx = new Context();
        ctx.setVariable("confirmUrl", confirmUrl);
        String html = templateEngine.process("confirmation", ctx);
        emailService.send(sub.getEmail(), "Bitte bestätige deine Anmeldung – up2daite", html);
    }

    private static String randomToken() {
        byte[] bytes = new byte[32];
        RNG.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
