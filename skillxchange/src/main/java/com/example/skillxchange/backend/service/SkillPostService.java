package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.repository.SkillPostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SkillPostService {

    private final SkillPostRepository postRepository;
    private final NotificationPostService notificationService;

    public SkillPostService(SkillPostRepository postRepository, NotificationPostService notificationService) {
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public List<SkillPost> getAllPosts() {
        return postRepository.findAll();
    }

    public List<SkillPost> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public SkillPost createPost(SkillPost post) {
        SkillPost savedPost = postRepository.save(post);

        // ✅ Create notification (dummy recipient for testing)
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setRecipientUserId("dummyUser123"); // 🔁 Replace with real follower logic later
        notification.setSenderUserId(post.getUserId());
        notification.setPostId(savedPost.getId());
        notification.setMessage("User " + post.getUserId() + " created a new post.");
        notificationService.createNotification(notification);

        return savedPost;
    }

    public Optional<SkillPost> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    public SkillPost updatePost(SkillPost existingPost, SkillPost updatedPost) {
        if (updatedPost.getMediaLink() != null) {
            existingPost.setMediaLink(updatedPost.getMediaLink());
        }
        if (updatedPost.getMediaType() != null) {
            existingPost.setMediaType(updatedPost.getMediaType());
        }
        if (updatedPost.getContentDescription() != null) {
            existingPost.setContentDescription(updatedPost.getContentDescription());
        }
        return postRepository.save(existingPost);
    }
}
