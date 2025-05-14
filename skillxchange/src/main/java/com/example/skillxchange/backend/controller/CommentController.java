package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Comment;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.CommentRepository;
import com.example.skillxchange.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "[http://localhost:3000](http://localhost:3000)")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

@Autowired
private CommentRepository commentRepository;

@Autowired
private UserRepository userRepository;

// ✅ POST: Create a new Comment with userId set automatically
@PostMapping
public ResponseEntity<Comment> createComment(@RequestBody Comment request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    Optional<User> userOpt = userRepository.findByUsername(username);
    if (!userOpt.isPresent()) {
        return ResponseEntity.status(401).build();
    }

    User user = userOpt.get();

    if (request.getPostId() == null || request.getCommentText() == null || request.getCommentText().trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    Comment comment = new Comment();
    comment.setUserId(user.getId());
    comment.setPostId(request.getPostId());
    comment.setCommentText(request.getCommentText());
    comment.setTimestamp(new java.util.Date());

    Comment saved = commentRepository.save(comment);
    return ResponseEntity.ok(saved);
}

@GetMapping
public List<Comment> getAllComments() {
    List<Comment> comments = commentRepository.findAll();
    enrichWithUserDetails(comments);
    return comments;
}

@GetMapping("/{id}")
public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
    Optional<Comment> comment = commentRepository.findById(id);
    if (comment.isPresent()) {
        Optional<User> user = userRepository.findById(comment.get().getUserId());
        if (user.isPresent()) {
            comment.get().setUsername(user.get().getUsername());
            comment.get().setUserImage(user.get().getProfilePicture());
        }
        return ResponseEntity.ok(comment.get());
    }
    return ResponseEntity.notFound().build();
}

@PutMapping("/{id}")
public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment commentDetails) {
    return commentRepository.findById(id).map(comment -> {
        comment.setCommentText(commentDetails.getCommentText());
        return ResponseEntity.ok(commentRepository.save(comment));
    }).orElseGet(() -> ResponseEntity.notFound().build());
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteComment(@PathVariable String id) {
    return commentRepository.findById(id).map(comment -> {
        commentRepository.delete(comment);
        return ResponseEntity.ok().build();
    }).orElseGet(() -> ResponseEntity.notFound().build());
}

@GetMapping("/post/{postId}")
public List<Comment> getCommentsByPostId(@PathVariable String postId) {
    List<Comment> comments = commentRepository.findByPostId(postId);
    enrichWithUserDetails(comments);
    return comments;
}

private void enrichWithUserDetails(List<Comment> comments) {
    for (Comment comment : comments) {
        Optional<User> user = userRepository.findById(comment.getUserId());
        if (user.isPresent()) {
            comment.setUsername(user.get().getUsername());
            comment.setUserImage(user.get().getProfilePicture());
        } else {
            comment.setUsername("Unknown User");
            comment.setUserImage("defaultProfilePic.jpg");
        }
    }
}


}   