package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "posts")
public class SkillPost {
    @Id
    private String id;
    private String userId;
    private Date timestamp;
    private String contentDescription;
    private String mediaLink;
    private String mediaType;

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getContentDescription() {
        return contentDescription;
    }

    public String getMediaLink() {
        return mediaLink;
    }

    public String getMediaType() {
        return mediaType;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public void setContentDescription(String contentDescription) {
        this.contentDescription = contentDescription;
    }

    public void setMediaLink(String mediaLink) {
        this.mediaLink = mediaLink;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
}
