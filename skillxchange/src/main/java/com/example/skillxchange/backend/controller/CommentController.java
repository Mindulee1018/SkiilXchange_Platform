package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Comment;
import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.model.SkillPost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.skillxchange.backend.service.CommentService;
import com.example.skillxchange.backend.repository.NotificationRepository;
import com.example.skillxchange.backend.repository.SkillPostRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SkillPostRepository skillPostRepository;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment request) {
        if (request.getPostId() == null || request.getCommentText() == null
                || request.getCommentText().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Save the comment
            Comment savedComment = commentService.createComment(request);

            // Fetch the post to get the post owner's userId
            Optional<SkillPost> postOpt = skillPostRepository.findById(savedComment.getPostId());

            if (postOpt.isPresent()) {
                SkillPost post = postOpt.get();

                // Notify the post owner if the commenter is not the owner
                if (!post.getUserId().equals(savedComment.getUserId())) {
                    Notification notification = new Notification();
                    notification.setUserId(post.getUserId()); // Receiver (post owner)
                    notification.setSenderId(savedComment.getUserId()); // Sender (commenter)
                    notification.setPostId(post.getId());
                    notification.setMessage(savedComment.getUsername() + " commented on your post.");
                    notification.setType("comment");
                    notification.setRead(false);
                    notification.setTimestamp(new Date());

                    notificationRepository.save(notification);
                }
            }

            return ResponseEntity.ok(savedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
    
    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    //Get Comments by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Update comments by Id
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