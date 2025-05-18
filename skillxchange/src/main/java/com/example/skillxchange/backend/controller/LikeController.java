package com.example.skillxchange.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.example.skillxchange.backend.model.Like;
import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.LikeRepository;
import com.example.skillxchange.backend.repository.NotificationRepository;
import com.example.skillxchange.backend.repository.SkillPostRepository;
import com.example.skillxchange.backend.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeRepository likeRepository;

    @Autowired
    public LikeController(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SkillPostRepository skillPostRepository;

    @Autowired
    private UserRepository userRepository;
    
    //Get likes 
    @GetMapping("/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable String postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        return new ResponseEntity<>(likes, HttpStatus.OK);
    }

    @PostMapping("/{postId}")
    public ResponseEntity<?> createLike(@PathVariable String postId) {
        // Get authenticated user's ID from JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // or from a custom claim if needed

        // Prevent duplicate likes
        if (likeRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already liked");
        }

        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(userId);
        Like savedLike = likeRepository.save(like);

        // Fetch the post to get the post owner's userId
        Optional<SkillPost> postOpt = skillPostRepository.findById(postId);
        if (postOpt.isPresent()) {
            SkillPost post = postOpt.get();

            // Notify the post owner if the liker is not the owner
            if (!post.getUserId().equals(userId)) {
                Notification notification = new Notification();
                notification.setUserId(post.getUserId()); // Receiver (post owner)
                notification.setSenderId(userId); // Sender (liker)
                notification.setPostId(post.getId());

                // Get liker username
                Optional<User> userOpt = userRepository.findById(userId);
                String likerUsername = userOpt.map(User::getUsername).orElse("Someone");
                notification.setMessage(likerUsername + " liked your post.");
                notification.setType("like");
                notification.setRead(false);
                notification.setTimestamp(new Date());

                notificationRepository.save(notification);
            }
        }

        return new ResponseEntity<>(savedLike, HttpStatus.CREATED);
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<?> deleteLikeByPostId(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        return likeRepository.findByPostIdAndUserId(postId, userId)
                .map(like -> {
                    likeRepository.delete(like);
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>("Like not found", HttpStatus.NOT_FOUND));
    }

}