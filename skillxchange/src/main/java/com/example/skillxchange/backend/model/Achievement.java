package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "achievements")
public class Achievement {

    @Id
    private String id;

    private String code;
    private String title;
    private String description;
    private String type;
    private Condition condition;
    private String icon;
    private Instant createdAt = Instant.now();

    public Achievement() {
    }

    public Achievement(String code, String title, String description, String type, Condition condition, String icon) {
        this.code = code;
        this.title = title;
        this.description = description;
        this.type = type;
        this.condition = condition;
        this.icon = icon;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public static class Condition {
        private String action;
        private int count;

        public Condition() {
        }

        public Condition(String action, int count) {
            this.action = action;
            this.count = count;
        }

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }
}
