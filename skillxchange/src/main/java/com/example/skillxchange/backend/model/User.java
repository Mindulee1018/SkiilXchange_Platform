package com.example.skillxchange.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;


@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private Set<String> followingIds = new HashSet<>();
    private Set<String> followerIds = new HashSet<>();
    private Set<String> followedTags = new HashSet<>();

    private String profilePicture; 
    private String description;


    /// Default constructor
    public User() {}

    // Constructor
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getter for id
    public String getId() {
        return id;
    }

    // Setter for id
    public void setId(String id) {
        this.id = id;
    }

    // Getter for username
    public String getUsername() {
        return username;
    }

    // Setter for username
    public void setUsername(String username) {
        this.username = username;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter for password
    public String getPassword() {
        return password;
    }

    // Setter for password
    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getFollowingIds() {
        return followingIds;
    }

    public void setFollowingIds(Set<String> followingIds) {
        this.followingIds = followingIds;
    }

    public Set<String> getFollowerIds() {
        return followerIds;
    }

    public void setFollowerIds(Set<String> followerIds) {
        this.followerIds = followerIds;
    }

    public Set<String> getFollowedTags() {
        return followedTags;
    }

    public void setFollowedTags(Set<String> followedTags) {
        this.followedTags = followedTags;
    }

    // Getter for password
    public String getProfilePicture() {
        return profilePicture;
    }

    // Setter for password
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    // Getter for password
    public String getDescription() {
        return description;
    }

    // Setter for password
    public void setDescription(String description) {
        this.description = description;
    }
}