package com.example.skillxchange.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.skillxchange.backend.model.ProgressUpdate;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendPlanNotification(ProgressUpdate update) {
        messagingTemplate.convertAndSend("/topic/notifications", update);
    }

}
