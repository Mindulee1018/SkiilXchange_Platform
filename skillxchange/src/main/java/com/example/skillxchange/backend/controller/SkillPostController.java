// SkillPostController.java (Updated)
package com.example.skillxchange.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    //get posts by user
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
   @PostMapping("/upload/multi")
public ResponseEntity<SkillPost> uploadMultipleMedia(
        @RequestParam("username") String username,
        @RequestParam("Description") String description,
        @RequestParam("FilePath") List<MultipartFile> files) {

    try {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        User user = userOpt.get();

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        List<String> mediaLink = new ArrayList<>();
        List<String> mediaType = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String mimeType = Files.probeContentType(filePath);

            mediaLink.add("uploads/" + fileName);
            mediaType.add(mimeType);
        }

        SkillPost post = new SkillPost();
        post.setUserId(user.getId());
        post.setContentDescription(description);
        post.setTimestamp(new Date());
        post.setMediaLink(mediaLink);
        post.setMediaType(mediaType);

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


    
}
