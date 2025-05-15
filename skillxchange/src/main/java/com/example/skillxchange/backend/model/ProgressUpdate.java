package com.example.skillxchange.backend.model;

import java.util.Date;
import java.util.Objects;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ProgressUpdate")
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;
    private String planId;
    private String type; // "CREATE", "UPDATE", "DELETE", "STARTED"
    private String message;
    private Date timestamp;
    private boolean read = false;

    // Default constructor
    public ProgressUpdate() {
        this.timestamp = new Date();
    }

    // Parameterized constructor
    public ProgressUpdate(String userId, String planId, String type, String message) {
        this.userId = userId;
        this.planId = planId;
        setType(type);
        this.message = message;
        this.timestamp = new Date();
        this.read = false;
    }

    // Getters and setters
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

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        if (type.equals("CREATE") || type.equals("UPDATE") || type.equals("DELETE") || type.equals("STARTED")) {
            this.type = type;
        } else {
            throw new IllegalArgumentException("Invalid type: " + type);
        }
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    // toString for logging
    @Override
    public String toString() {
        return "ProgressUpdate{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", planId='" + planId + '\'' +
                ", type='" + type + '\'' +
                ", message='" + message + '\'' +
                ", timestamp=" + timestamp +
                ", read=" + read +
                '}';
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProgressUpdate)) return false;
        ProgressUpdate that = (ProgressUpdate) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
