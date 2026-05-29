package com.up2daite.backend.service;

import com.up2daite.backend.entity.EditionEntity;
import com.up2daite.backend.entity.SubscriberEntity;
import com.up2daite.backend.repository.EditionRepository;
import com.up2daite.backend.repository.SubscriberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

/**
 * Versendet eine Edition an alle bestätigten Subscriber.
 *
 * V1: synchron, bricht bei mehr als BREVO_DAILY_LIMIT Empfängern mit Fehler ab.
 * V2: asynchrone Queue mit Rate-Limiter.
 */
@Service
public class NewsletterSendService {

    private static final Logger log = LoggerFactory.getLogger(NewsletterSendService.class);
    private static final SecureRandom RNG = new SecureRandom();
    private static final int BREVO_DAILY_LIMIT = 300;

    private final SubscriberRepository subscriberRepository;
    private final EditionRepository editionRepository;
    private final BrevoEmailService emailService;
    private final TemplateEngine templateEngine;
    private final String appBaseUrl;

    public NewsletterSendService(SubscriberRepository subscriberRepository,
                                 EditionRepository editionRepository,
                                 BrevoEmailService emailService,
                                 TemplateEngine templateEngine,
                                 @Value("${app.base-url}") String appBaseUrl) {
        this.subscriberRepository = subscriberRepository;
        this.editionRepository = editionRepository;
        this.emailService = emailService;
        this.templateEngine = templateEngine;
        this.appBaseUrl = appBaseUrl;
    }

    public record SendResult(int total, int sent, int failed) {}

    @Transactional
    public SendResult sendEdition(String editionId) {
        Optional<EditionEntity> opt = editionRepository.findById(editionId);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Edition nicht gefunden: " + editionId);
        }
        EditionEntity edition = opt.get();
        if (!"published".equals(edition.getStatus())) {
            throw new IllegalStateException("Nur veröffentlichte Editions können verschickt werden.");
        }

        List<SubscriberEntity> recipients = subscriberRepository.findAllByConfirmedTrueAndUnsubscribedAtIsNull();
        if (recipients.size() > BREVO_DAILY_LIMIT) {
            throw new IllegalStateException(
                    "Subscriber-Limit für Free-Tier überschritten (" + recipients.size()
                            + " > " + BREVO_DAILY_LIMIT + "). Queue/Throttling kommt in V2.");
        }

        String editionUrl = appBaseUrl + "/ausgabe/" + edition.getSlug();
        int sent = 0;
        int failed = 0;
        for (SubscriberEntity sub : recipients) {
            if (sub.getUnsubscribeToken() == null) {
                sub.setUnsubscribeToken(randomToken());
                subscriberRepository.save(sub);
            }
            String unsubscribeUrl = appBaseUrl + "/unsubscribe?token=" + sub.getUnsubscribeToken();

            Context ctx = new Context();
            ctx.setVariable("edition", edition);
            ctx.setVariable("stories", edition.getStories());
            ctx.setVariable("editionUrl", editionUrl);
            ctx.setVariable("unsubscribeUrl", unsubscribeUrl);
            String html = templateEngine.process("newsletter", ctx);

            boolean ok = emailService.send(sub.getEmail(), edition.getTitle(), html);
            if (ok) sent++; else failed++;
        }
        log.info("Newsletter-Versand für Edition {} abgeschlossen: {} gesendet, {} Fehler.",
                editionId, sent, failed);
        return new SendResult(recipients.size(), sent, failed);
    }

    private static String randomToken() {
        byte[] bytes = new byte[32];
        RNG.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
