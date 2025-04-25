package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.dto.NotificationMessageDTO;
import com.example.skillxchange.backend.model.ProgressUpdate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationPublisher {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendPlanNotification(ProgressUpdate update) {
        messagingTemplate.convertAndSend("/topic/learning-plans", update);
    }
}
