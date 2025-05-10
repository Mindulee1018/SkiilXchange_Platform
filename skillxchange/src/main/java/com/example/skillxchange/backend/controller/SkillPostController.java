// SkillPostController.java (Updated)
package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.service.SkillPostService;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api/posts")
public class SkillPostController {

        private UserRepository userRepository;


    private final SkillPostService postService;

    public SkillPostController(SkillPostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<SkillPost>> getPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<SkillPost>> getPostsByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(postService.getPostsByUserId(userId), HttpStatus.OK);
    }

    
    @PostMapping
    public ResponseEntity<SkillPost> createPost(@RequestBody SkillPost post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/upload")
public ResponseEntity<SkillPost> uploadPostWithMedia(
        @RequestParam("username") String username,
        @RequestParam("Description") String description,
        @RequestParam("FilePath") MultipartFile file) {

    try {
        // 1. Look up the User by username
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        User user = userOpt.get();

        // 2. Save the uploaded file to disk
        String uploadDir = "uploads/";
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 3. Create the SkillPost and set its properties
        SkillPost post = new SkillPost();

        // ←—— HERE: assign the user’s ID to the post
        post.setUserId(user.getId());

        post.setContentDescription(description);
        post.setMediaLink(filePath.toString());
        post.setTimestamp(new Date());    // also good to set a timestamp here

        // 4. Persist the post
        SkillPost saved = postService.createPost(post);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);

    } catch (IOException e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<SkillPost> updatePost(@PathVariable String postId, @RequestBody SkillPost updatedPost) {
        Optional<SkillPost> optionalPost = postService.getPostById(postId);
        return optionalPost.map(existingPost ->
                new ResponseEntity<>(postService.updatePost(existingPost, updatedPost), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
