package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Deadlines")
public class Deadline {
    @Id
    private String id;

    private String userId;
    private String taskTitle;
    private String learningPlanId;
    private Date dueDate;
    private String notificationMessage;
    private boolean notified = false;

    // Constructors
    public Deadline() {}

    public Deadline(String userId, String taskTitle, Date dueDate, String notificationMessage, boolean notified) {
        this.userId = userId;
        this.taskTitle = taskTitle;
        this.dueDate = dueDate;
        this.notified = notified;
        this.notificationMessage = notificationMessage;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public String getLearningPlanId() { return learningPlanId; }
    public void setLearningPlanId(String learningPlanId) { this.learningPlanId = learningPlanId; }

    public Date getDueDate() { return dueDate; }    
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public String getNotificationMessage() { return notificationMessage; }
    public void setNotificationMessage(String notificationMessage) {
        this.notificationMessage = notificationMessage;
    }

    public boolean isNotified() { return notified; }    
    public void setNotified(boolean notified) { this.notified = notified; } 
}
