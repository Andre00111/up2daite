-- Flyway Migration V4: Subscribers-Tabelle für Double-Opt-In erweitern.
-- confirmed=true wird per Bestätigungs-Link gesetzt, unsubscribed_at per Abmelde-Link.

ALTER TABLE subscribers
    ADD COLUMN confirmed          BOOLEAN     NOT NULL DEFAULT FALSE,
    ADD COLUMN confirmation_token VARCHAR(64),
    ADD COLUMN unsubscribe_token  VARCHAR(64),
    ADD COLUMN confirmed_at       TIMESTAMP,
    ADD COLUMN unsubscribed_at    TIMESTAMP;

CREATE INDEX idx_subscribers_confirmation_token ON subscribers(confirmation_token);
CREATE INDEX idx_subscribers_unsubscribe_token  ON subscribers(unsubscribe_token);
