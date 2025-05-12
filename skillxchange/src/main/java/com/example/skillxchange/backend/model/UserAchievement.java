package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_achievements")
public class UserAchievement {

    @Id
    private String id;

    private String userId;
    private String achievementCode;
    private Instant achievedAt = Instant.now();

    public UserAchievement() {
    }

    public UserAchievement(String userId, String achievementCode) {
        this.userId = userId;
        this.achievementCode = achievementCode;
        this.achievedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAchievementCode() {
        return achievementCode;
    }

    public void setAchievementCode(String achievementCode) {
        this.achievementCode = achievementCode;
    }

    public Instant getAchievedAt() {
        return achievedAt;
    }

    public void setAchievedAt(Instant achievedAt) {
        this.achievedAt = achievedAt;
    }
}
