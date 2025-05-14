package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String postId;
    private String commentText;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date timestamp;

    @Transient
    private String username;

    @Transient
    private String userImage;

    public Comment() {}

    public Comment(String id, String postId, String commentText, Date timestamp) {
        this.id = id;
        this.postId = postId;
        this.commentText = commentText;
        this.timestamp = timestamp;
    }

    // Getters and Setters
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

    public String getUserImage() {
        return userImage;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }

    @Override
    public String toString() {
        return "Comment{id='" + id + "', postId='" + postId + "', commentText='" + commentText + "', timestamp=" + timestamp + ", username='" + username + "'}";
    }
}
