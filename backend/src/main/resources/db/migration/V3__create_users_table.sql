-- Flyway Migration V3: Admin-User-Tabelle für Auth
-- User werden beim Backend-Start per UserSeedRunner aus ENV-Variablen geseeded.

CREATE TABLE users (
    id            UUID         PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);
