package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.NotificationRepository;
import com.example.skillxchange.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/users")
public class UserFollowController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    //follow a user
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> targetOpt = userRepository.findById(id);
        Optional<User> followerOpt = userRepository.findByUsername(userDetails.getUsername());

        if (targetOpt.isEmpty() || followerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User target = targetOpt.get();       // The user being followed
        User follower = followerOpt.get();   // The logged-in user

        if (target.getId().equals(follower.getId())) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }

        if (target.getFollowerIds().add(follower.getId())) {
            follower.getFollowingIds().add(target.getId());
            userRepository.save(target);
            userRepository.save(follower);
        }

        // Create and save notification for the followed user
        Notification notification = new Notification();
        notification.setUserId(target.getId());      // Receiver (the user being followed)
        notification.setSenderId(follower.getId());  // Sender (the follower)
        
        // Optional: you can include follower's username in the message
        notification.setMessage(follower.getUsername() + " started following you.");
        notification.setType("follow");
        notification.setRead(false);
        notification.setTimestamp(new Date());

        notificationRepository.save(notification);

        return ResponseEntity.ok("Followed successfully");
    }
    //unfollow a user
    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> targetOpt = userRepository.findById(id);
        Optional<User> followerOpt = userRepository.findByUsername(userDetails.getUsername());

        if (targetOpt.isEmpty() || followerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User target = targetOpt.get();
        User follower = followerOpt.get();

        target.getFollowerIds().remove(follower.getId());
        follower.getFollowingIds().remove(target.getId());
        userRepository.save(target);
        userRepository.save(follower);

        return ResponseEntity.ok("Unfollowed successfully");
    }
    //get user followers
    @GetMapping("/{id}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        List<User> followers = user.getFollowerIds().stream()
                .map(userRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return ResponseEntity.ok(followers);
    }
    //get user following
    @GetMapping("/{id}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        List<User> following = user.getFollowingIds().stream()
                .map(userRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return ResponseEntity.ok(following);
    }
     //follow a tag
    @PostMapping("/tags/follow")
    public ResponseEntity<?> followTag(@RequestParam String tag, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        if (user.getFollowedTags().add(tag.trim().toLowerCase())) {
            userRepository.save(user);
        }

        return ResponseEntity.ok("Tag followed successfully");
    }

    //unfollow a tag
    @DeleteMapping("/tags/unfollow")
    public ResponseEntity<?> unfollowTag(@RequestParam String tag, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        user.getFollowedTags().remove(tag.trim().toLowerCase());
        userRepository.save(user);

        return ResponseEntity.ok("Tag unfollowed successfully");
    }

    //get followed tags
    @GetMapping("/tags")
    public ResponseEntity<?> getFollowedTags(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        return ResponseEntity.ok(userOpt.get().getFollowedTags());
    }
}
