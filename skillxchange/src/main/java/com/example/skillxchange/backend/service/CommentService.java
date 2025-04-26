package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.Comment;
import com.example.skillxchange.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(Comment comment) {
        comment.setTimestamp(new Date()); // Ensure timestamp is set when created
        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    public Optional<Comment> updateComment(String id, Comment commentDetails) {
        return commentRepository.findById(id).map(comment -> {
            comment.setCommentText(commentDetails.getCommentText());
            return commentRepository.save(comment);
        });
    }

    public boolean deleteComment(String id) {
        return commentRepository.findById(id).map(comment -> {
            commentRepository.delete(comment);
            return true;
        }).orElse(false);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
