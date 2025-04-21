package com.example.skillxchange.backend.model;

import java.util.Date;

public class Task {
    private String title;
    private String description;
    private Date dueDate;
    private boolean completed = false;
    private int durationInDays;
    private Date completedAt;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getDurationInDays() { return durationInDays; }
    public void setDurationInDays(int durationInDays) { this.durationInDays = durationInDays; }

    public Date getCompletedAt() { return completedAt; }
    public void setCompletedAt(Date completedAt) { this.completedAt = completedAt; }
}
