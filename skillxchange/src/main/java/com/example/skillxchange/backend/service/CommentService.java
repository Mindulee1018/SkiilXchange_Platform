package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.Comment;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.CommentRepository;
import com.example.skillxchange.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a comment
    public Comment createComment(Comment commentRequest) {
        // Get the currently authenticated user from the SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Get the username from the authenticated user

        // Retrieve the user from the repository using the username
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Create a new comment and set relevant fields
        Comment comment = new Comment();
        comment.setPostId(commentRequest.getPostId());
        comment.setCommentText(commentRequest.getCommentText());
        comment.setTimestamp(new Date());

        // Enrich with user details
        comment.setUsername(user.getUsername());
        comment.setUserImage(user.getProfilePicture());

        return commentRepository.save(comment); // Save and return the created comment
    }

    // Get all comments (sorted by timestamp)
    public List<Comment> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return enrichWithUsernames(comments);
    }

    // Get a comment by its ID
    public Optional<Comment> getCommentById(String id) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        commentOpt.ifPresent(this::enrichWithUsername);
        return commentOpt;
    }

    // Update an existing comment, only if the authenticated user is the owner
    public Optional<Comment> updateComment(String id, Comment commentDetails) {
        Optional<Comment> existingCommentOpt = commentRepository.findById(id);
        if (!existingCommentOpt.isPresent()) {
            return Optional.empty();
        }

        Comment existingComment = existingCommentOpt.get();

        // Get the currently authenticated user from the SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Get the username from the authenticated user

        // Check if the user is the owner of the comment
        if (!existingComment.getUsername().equals(username)) {
            return Optional.empty(); // Unauthorized
        }

        existingComment.setCommentText(commentDetails.getCommentText());
        return Optional.of(commentRepository.save(existingComment));
    }

    // Delete a comment, only if the authenticated user is the owner
    public boolean deleteComment(String id) {
        Optional<Comment> existingCommentOpt = commentRepository.findById(id);
        if (!existingCommentOpt.isPresent()) {
            return false; // Comment not found
        }

        Comment existingComment = existingCommentOpt.get();

        // Get the currently authenticated user from the SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Get the username from the authenticated user

        // Check if the user is the owner of the comment
        if (!existingComment.getUsername().equals(username)) {
            return false; // Unauthorized
        }

        commentRepository.delete(existingComment);
        return true; // Comment deleted
    }

    // Get all comments related to a specific post (sorted by timestamp)
    public List<Comment> getCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return enrichWithUsernames(
            comments.stream()
                    .sorted((c1, c2) -> c2.getTimestamp().compareTo(c1.getTimestamp())) // Sorting by timestamp descending
                    .collect(Collectors.toList())
        );
    }

    // Private helper method to enrich a single comment with username and profile picture
    private void enrichWithUsername(Comment comment) {
        Optional<User> userOpt = userRepository.findByUsername(comment.getUsername()); // Fetch based on username
        userOpt.ifPresent(user -> {
            comment.setUsername(user.getUsername());
            comment.setUserImage(user.getProfilePicture());
        });
    }

    // Private helper method to enrich a list of comments with usernames and profile pictures
    private List<Comment> enrichWithUsernames(List<Comment> comments) {
        for (Comment comment : comments) {
            enrichWithUsername(comment);
        }
        return comments;
    }
}
