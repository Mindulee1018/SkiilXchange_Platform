package com.example.skillxchange.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.skillxchange.backend.model.Like;
import com.example.skillxchange.backend.repository.LikeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeRepository likeRepository;

    @Autowired
    public LikeController(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

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