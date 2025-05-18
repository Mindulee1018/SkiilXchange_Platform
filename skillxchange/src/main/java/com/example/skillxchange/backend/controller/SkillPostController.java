package com.example.skillxchange.backend.controller;



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.service.SkillPostService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class SkillPostController {

    private final SkillPostService postService;
    private final UserRepository userRepository;

    public SkillPostController(SkillPostService postService, UserRepository userRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
    }

    //get all posts
    @GetMapping
    public ResponseEntity<List<SkillPost>> getPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    //get posts by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkillPost>> getPostsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    //endpoint to upload without media
    /*@PostMapping
    public ResponseEntity<SkillPost> createPost(@RequestBody SkillPost post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }*/

    //upload user with media
    @PostMapping("/upload")
    public ResponseEntity<SkillPost> uploadPostWithMedia(
            @RequestParam("username") String username,
            @RequestParam("Description") String description,
            @RequestParam("FilePath") MultipartFile file) {

        try {
            // 1. Look up the User by username
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            User user = userOpt.get();

            // save the file to /uploads
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String mimeType = Files.probeContentType(filePath);


            // Create the SkillPost
            SkillPost post = new SkillPost();
            post.setUserId(user.getId());
            post.setContentDescription(description);
            post.setMediaLink("uploads/" + fileName);
            post.setMediaType(mimeType);
            post.setTimestamp(new Date());    // also good to set a timestamp here

            //save the post
            SkillPost saved = postService.createPost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //delete the post
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    //update the post
    @PutMapping("/{postId}")
    public ResponseEntity<SkillPost> updatePost(
            @PathVariable String postId,
            @RequestBody SkillPost updatedPost) {

        Optional<SkillPost> optionalPost = postService.getPostById(postId);
        return optionalPost
                .map(existing -> ResponseEntity.ok(postService.updatePost(existing, updatedPost)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/foryou")
    public ResponseEntity<?> getForYouPosts(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        User user = userOpt.get();

        // Posts by followed users
        List<SkillPost> followedUserPosts = postService.getPostsByUserIds(user.getFollowingIds());

        // Recent public posts (assuming all posts are public for now)
        List<SkillPost> recentPosts = postService.getRecentPosts(); // implement this

        List<SkillPost> allPosts = new ArrayList<>();
            allPosts.addAll(followedUserPosts);
            allPosts.addAll(recentPosts);

        Map<String, SkillPost> uniquePostsById = new LinkedHashMap<>();
        for (SkillPost post : allPosts) {
            uniquePostsById.put(post.getId(), post);
        }

        // Remove user's own posts
        List<SkillPost> result = uniquePostsById.values()
            .stream()
            .filter(p -> !p.getUserId().equals(user.getId()))
            .toList();

        return ResponseEntity.ok(result);
    }
}
