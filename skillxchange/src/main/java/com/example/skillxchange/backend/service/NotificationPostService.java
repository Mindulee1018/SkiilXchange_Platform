package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationPostService {

    private final NotificationRepository notificationRepository;

    public NotificationPostService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(Notification notification) {
        notificationRepository.save(notification);
    }
}
