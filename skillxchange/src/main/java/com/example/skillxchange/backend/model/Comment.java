package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId;
    private String userId;
    private String commentText;
    private Date timestamp;

    @Transient
    private String username; // Not stored in MongoDB, used for response

    @Transient
    private String userImage; // Not stored in MongoDB

    public Comment() {}

    public Comment(String id, String userId, String postId, String commentText, Date timestamp) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.timestamp = timestamp;
    }

    // Getters and setters for all fields including username

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserImage() { return userImage; }

    public void setUserImage(String userImage) { this.userImage = userImage; }
}
