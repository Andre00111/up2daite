package com.up2daite.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Routen-Schutz:
 *   - /api/admin/**  → ROLE_ADMIN
 *   - /api/auth/me   → authentifiziert
 *   - Alles andere   → öffentlich (CORS-fähig)
 *
 * Stateless (kein Session-Cookie), CSRF aus (JWT in HttpOnly+SameSite=Strict Cookie
 * deckt CSRF ab; statt CSRF-Token).
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final List<String> allowedOrigins;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          @Value("${app.cors.allowed-origins}") List<String> allowedOrigins) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/editions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/stories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/topics/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ai-jobs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ai-models/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/subscribers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/subscribers/confirm").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/subscribers/unsubscribe").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus").permitAll()
                        // Admin Endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Write-Endpoints für Stories/Editions schützen
                        .requestMatchers(HttpMethod.POST, "/api/editions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/editions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/editions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/stories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/stories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/stories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/ai-jobs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/ai-jobs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/ai-jobs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/ai-models/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/ai-models/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/ai-models/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(allowedOrigins);
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true); // wichtig für HttpOnly-Cookie!
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
