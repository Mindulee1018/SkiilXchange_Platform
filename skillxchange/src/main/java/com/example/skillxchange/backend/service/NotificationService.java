package com.example.skillxchange.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.model.ProgressUpdate;
import com.example.skillxchange.backend.repository.NotificationRepository;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendPlanNotification(ProgressUpdate update) {
        messagingTemplate.convertAndSend("/topic/notifications", update);
    }

    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

}
