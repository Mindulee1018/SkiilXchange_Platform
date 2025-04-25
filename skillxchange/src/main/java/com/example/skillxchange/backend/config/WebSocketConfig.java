package com.example.skillxchange.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // clients will subscribe to this
        config.setApplicationDestinationPrefixes("/app"); // clients send messages here
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // endpoint clients will connect to
                .setAllowedOrigins("*")
                .withSockJS(); // fallback for browsers that don’t support WebSocket
    }
    
}
