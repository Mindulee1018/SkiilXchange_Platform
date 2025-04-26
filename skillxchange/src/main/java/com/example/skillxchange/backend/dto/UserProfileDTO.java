package com.example.skillxchange.backend.dto;

public class UserProfileDTO {
    private String id;
    private String username;
    private String email;
    private String profilePicture;
    private String description;
    private int followers;
    private int following;

    public UserProfileDTO() {}

    public UserProfileDTO(String id, String username, String email,String profilePicture, String description, int followers, int following) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePicture = profilePicture;
        this.description = description;
        this.followers = followers;
        this.following = following;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() { 
        return profilePicture; 
    }

    public void setProfilePicture(String profilePicture) { 
        this.profilePicture = profilePicture; 
    }

    public String getDescription() {
        return description; 
    }
    public void setDescription(String description) { 
        this.description = description; 
    }

    public int getFollowers() { 
        return followers; 
    }
    public void setFollowers(int followers) { 
        this.followers = followers; 
    }

    public int getFollowing() { 
        return following; 
    }

    public void setFollowing(int following) { 
        this.following = following; 
    }
}   

