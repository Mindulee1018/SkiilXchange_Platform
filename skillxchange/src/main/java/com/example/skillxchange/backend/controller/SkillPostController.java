package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.service.SkillPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class SkillPostController {

    private final SkillPostService postService;

    //@Autowired
    public SkillPostController(SkillPostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<SkillPost>> getPosts() {
        List<SkillPost> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<SkillPost>> getPostsByUserId(@PathVariable String userId) {
        List<SkillPost> posts = postService.getPostsByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SkillPost> createPost(@RequestBody SkillPost post) {
        SkillPost savedPost = postService.createPost(post);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<SkillPost> updatePost(@PathVariable String postId, @RequestBody SkillPost updatedPost) {
        Optional<SkillPost> optionalPost = postService.getPostById(postId);
        if (optionalPost.isPresent()) {
            SkillPost existingPost = optionalPost.get();
            SkillPost savedPost = postService.updatePost(existingPost, updatedPost);
            return new ResponseEntity<>(savedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}     