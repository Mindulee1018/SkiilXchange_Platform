package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UserSettings")
public class UserSettings {
    @Id
    private String userId;

    private boolean commentNotifications = true;
    private boolean likeNotifications = true;
    private boolean progressUpdateNotifications = true;
    private boolean deadlineNotifications = true;

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isCommentNotifications() { return commentNotifications; }
    public void setCommentNotifications(boolean commentNotifications) { this.commentNotifications = commentNotifications; }

    public boolean isLikeNotifications() { return likeNotifications; }
    public void setLikeNotifications(boolean likeNotifications) { this.likeNotifications = likeNotifications; }

    public boolean isProgressUpdateNotifications() { return progressUpdateNotifications; }
    public void setProgressUpdateNotifications(boolean progressUpdateNotifications) { this.progressUpdateNotifications = progressUpdateNotifications; }

    public boolean isDeadlineNotifications() { return deadlineNotifications; }
    public void setDeadlineNotifications(boolean deadlineNotifications) { this.deadlineNotifications = deadlineNotifications; }
}
