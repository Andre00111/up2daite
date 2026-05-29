package com.up2daite.backend.controller;

import com.up2daite.backend.dto.LoginRequest;
import com.up2daite.backend.dto.UserInfoResponse;
import com.up2daite.backend.entity.UserEntity;
import com.up2daite.backend.repository.UserRepository;
import com.up2daite.backend.security.AuthCookieUtil;
import com.up2daite.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthCookieUtil cookieUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthCookieUtil cookieUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.cookieUtil = cookieUtil;
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<UserInfoResponse> login(@Valid @RequestBody LoginRequest request) {
        Optional<UserEntity> userOpt = userRepository.findByUsername(request.username());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).build();
        }

        UserEntity user = userOpt.get();
        user.setLastLoginAt(Instant.now());

        String token = jwtService.createToken(user.getUsername());
        ResponseCookie cookie = cookieUtil.buildAuthCookie(token, JwtService.TTL.toSeconds());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new UserInfoResponse(user.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cleared = cookieUtil.buildClearCookie();
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cleared.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserInfoResponse(authentication.getName()));
    }
}
