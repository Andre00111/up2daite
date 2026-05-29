package com.up2daite.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "subscribers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriberEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(unique = true, nullable = false, length = 200)
    private String email;

    @Column(name = "subscribed_at", nullable = false)
    private Instant subscribedAt;

    @Column(nullable = false)
    private boolean confirmed;

    @Column(name = "confirmation_token", length = 64)
    private String confirmationToken;

    @Column(name = "unsubscribe_token", length = 64)
    private String unsubscribeToken;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "unsubscribed_at")
    private Instant unsubscribedAt;
}
