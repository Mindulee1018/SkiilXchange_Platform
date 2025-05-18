package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByTimestampDesc(String userId);
    List<Notification> findByUserId(String userId);
    Optional<Notification> findByIdAndUserId(String id, String userId);

}
