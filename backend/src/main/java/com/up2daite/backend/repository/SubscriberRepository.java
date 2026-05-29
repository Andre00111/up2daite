package com.up2daite.backend.repository;

import com.up2daite.backend.entity.SubscriberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<SubscriberEntity, String> {
    Optional<SubscriberEntity> findByEmail(String email);
    Optional<SubscriberEntity> findByConfirmationToken(String token);
    Optional<SubscriberEntity> findByUnsubscribeToken(String token);
    List<SubscriberEntity> findAllByConfirmedTrueAndUnsubscribedAtIsNull();
    long countByConfirmedTrueAndUnsubscribedAtIsNull();
}
