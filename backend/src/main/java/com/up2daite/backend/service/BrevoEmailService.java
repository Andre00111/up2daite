package com.up2daite.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

/**
 * Versendet Mails über die Brevo (ex Sendinblue) Transactional-API.
 * Endpoint: https://api.brevo.com/v3/smtp/email
 * Docs:     https://developers.brevo.com/reference/sendtransacemail
 *
 * Free-Tier: 300 Mails/Tag. Wenn API-Key leer ist, wird der Versand übersprungen
 * und nur geloggt (für lokale Entwicklung ohne Brevo-Account).
 */
@Service
public class BrevoEmailService {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailService.class);
    private static final String API_URL = "https://api.brevo.com/v3/smtp/email";

    private final String apiKey;
    private final String senderEmail;
    private final String senderName;
    private final RestClient client;

    public BrevoEmailService(@Value("${app.brevo.api-key:}") String apiKey,
                             @Value("${app.brevo.sender-email}") String senderEmail,
                             @Value("${app.brevo.sender-name}") String senderName) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.client = RestClient.builder().baseUrl(API_URL).build();
    }

    /** Liefert true bei erfolgreichem Versand, false bei Fehlern. */
    public boolean send(String toEmail, String subject, String htmlContent) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("BREVO_API_KEY ist nicht gesetzt – Mail an {} (Betreff: {}) wird übersprungen.",
                    toEmail, subject);
            return false;
        }

        Map<String, Object> body = Map.of(
                "sender", Map.of("email", senderEmail, "name", senderName),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "htmlContent", htmlContent
        );

        try {
            client.post()
                    .header("api-key", apiKey)
                    .header("accept", "application/json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (RestClientException e) {
            log.error("Brevo-Versand an {} fehlgeschlagen: {}", toEmail, e.getMessage());
            return false;
        }
    }
}
