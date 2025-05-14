package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Comment;
import com.example.skillxchange.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Create a new Comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment request) {
        Comment savedComment = commentService.createComment(request);
        return ResponseEntity.ok(savedComment);
    }

    // Get all comments
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // Get a comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a comment (only by the owner)
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment commentDetails) {
        Optional<Comment> updatedComment = commentService.updateComment(id, commentDetails);
        return updatedComment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(403).build()); // Forbidden
    }

    // Delete a comment (only by the owner)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        boolean deleted = commentService.deleteComment(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.status(403).build(); // Forbidden if not the owner
    }

    // Get comments by postId
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}
