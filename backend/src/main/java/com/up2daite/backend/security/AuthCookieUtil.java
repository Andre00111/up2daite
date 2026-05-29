package com.up2daite.backend.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Baut und liest das HttpOnly-Auth-Cookie. Strict SameSite verhindert CSRF,
 * Secure-Flag ist in Produktion an, lokal aus (HTTP-Dev-Setup).
 */
@Component
public class AuthCookieUtil {

    public static final String COOKIE_NAME = "auth";

    private final boolean secure;

    public AuthCookieUtil(@Value("${app.cookie.secure:true}") boolean secure) {
        this.secure = secure;
    }

    public ResponseCookie buildAuthCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie buildClearCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
    }

    public String readToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (COOKIE_NAME.equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
