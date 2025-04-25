package com.example.skillxchange.backend.model;

import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ProgressUpdate")
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;
    private String planId;
    private String type; // "CREATE", "UPDATE", "DELETE"
    private String message;
    private Date timestamp; // use java.util.Date

    public ProgressUpdate() {
        this.timestamp = new Date();
    }

    public ProgressUpdate(String userId, String planId, String type, String message) {
        this.userId = userId;
        this.planId = planId;
        this.type = type;
        this.message = message;
        this.timestamp = new Date(); // set when created
    }

    // Getters and setters...

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
        this.type = type;
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
}