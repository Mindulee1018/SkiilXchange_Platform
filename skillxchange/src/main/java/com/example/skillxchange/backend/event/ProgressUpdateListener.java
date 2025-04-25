package com.example.skillxchange.backend.event;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

public class ProgressUpdateListener {
    private final SimpMessagingTemplate messagingTemplate;

    public ProgressUpdateListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleProgressUpdate(ProgressUpdateEvent event) {
        String destination = "/topic/progress/" + event.getUserId();
        Map<String, String> payload = Map.of(
            "action", event.getAction(),
            "title", event.getPlanTitle()
        );
        messagingTemplate.convertAndSend(destination, payload);
    }
    
}
