package com.up2daite.backend.config;

import com.up2daite.backend.entity.UserEntity;
import com.up2daite.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Legt beim Backend-Start die beiden Admin-User (andre, martin) an,
 * falls sie noch nicht existieren. Passwörter kommen aus ENV-Variablen.
 *
 * Idempotent: bei jedem Restart kein Effekt, wenn User schon da sind.
 * Bei fehlenden ENV-Variablen wird WARN geloggt, aber das Backend startet trotzdem
 * (damit man auch ohne gesetzte Secrets erstmal lokal hochfahren kann).
 */
@Component
public class UserSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(UserSeedRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String andrePassword;
    private final String martinPassword;
    private final String admin4653Password;

    public UserSeedRunner(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.admin.andre.password:}") String andrePassword,
                          @Value("${app.admin.martin.password:}") String martinPassword,
                          @Value("${app.admin.admin4653.password:}") String admin4653Password) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.andrePassword = andrePassword;
        this.martinPassword = martinPassword;
        this.admin4653Password = admin4653Password;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedIfMissing("andre", andrePassword);
        seedIfMissing("martin", martinPassword);
        seedIfMissing("admin4653", admin4653Password);
    }

    private void seedIfMissing(String username, String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            log.warn("Kein Passwort für Admin '{}' gesetzt (ENV-Variable fehlt) – wird nicht angelegt.", username);
            return;
        }
        if (userRepository.existsByUsername(username)) {
            log.info("Admin '{}' existiert bereits – kein Seeding.", username);
            return;
        }
        UserEntity user = UserEntity.builder()
                .id(UUID.randomUUID())
                .username(username)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .createdAt(Instant.now())
                .build();
        userRepository.save(user);
        log.info("Admin '{}' wurde angelegt.", username);
    }
}
