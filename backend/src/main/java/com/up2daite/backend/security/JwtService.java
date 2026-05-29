package com.up2daite.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * Erstellt und validiert JWTs für die Admin-Authentifizierung.
 * Tokens werden nicht im LocalStorage gespeichert, sondern als HttpOnly-Cookie
 * (siehe AuthCookieUtil). Damit kein XSS-Diebstahl möglich ist.
 */
@Service
public class JwtService {

    public static final Duration TTL = Duration.ofHours(12);

    private final SecretKey key;

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        // Min. 256 Bit Schlüssel für HS256
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret muss mindestens 32 Zeichen lang sein (256-bit für HS256)");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(String username) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username)
                .claim("role", "admin")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(TTL)))
                .signWith(key)
                .compact();
    }

    /** Liefert den Username (sub-Claim) oder wirft bei ungültigem Token. */
    public String parseUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
}
