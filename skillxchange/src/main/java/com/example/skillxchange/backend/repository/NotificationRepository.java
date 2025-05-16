package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientUserId(String userId);
}
