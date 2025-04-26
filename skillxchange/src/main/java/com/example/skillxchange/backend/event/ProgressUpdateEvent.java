package com.example.skillxchange.backend.event;

import org.springframework.context.ApplicationEvent;

public class ProgressUpdateEvent extends ApplicationEvent{
    private final String userId;
    private final String action;
    private final String planTitle;

    public ProgressUpdateEvent(Object source, String userId, String action, String planTitle) {
        super(source);
        this.userId = userId;
        this.action = action;
        this.planTitle = planTitle;
    }

    public String getUserId() { return userId; }
    public String getAction() { return action; }
    public String getPlanTitle() { return planTitle; }
    
}
