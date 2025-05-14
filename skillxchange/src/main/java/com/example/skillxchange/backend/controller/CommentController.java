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
import com.example.skillxchange.backend.service.CommentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment request) {
        if (request.getPostId() == null || request.getCommentText() == null || request.getCommentText().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Comment saved = commentService.createComment(request);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment commentDetails) {
        return commentService.updateComment(id, commentDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        return commentService.deleteComment(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(403).build();
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }
}