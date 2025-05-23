package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.SkillPost;
import com.example.skillxchange.backend.repository.SkillPostRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;
 

@Service
public class SkillPostService {

    private final SkillPostRepository postRepository;

    
    
    public SkillPostService(SkillPostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<SkillPost> getAllPosts() {
        return postRepository.findAll();
    }

    public List<SkillPost> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public SkillPost createPost(SkillPost post) {
        return postRepository.save(post);
    }

    public Optional<SkillPost> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    public SkillPost updatePost(SkillPost existingPost, SkillPost updatedPost) {
        if (updatedPost.getMediaLink() != null) {
            existingPost.setMediaLink(updatedPost.getMediaLink());
        }
        if (updatedPost.getMediaType() != null) {
            existingPost.setMediaType(updatedPost.getMediaType());
        }
        if (updatedPost.getContentDescription() != null) {
            existingPost.setContentDescription(updatedPost.getContentDescription());
        }
        return postRepository.save(existingPost);
    }

    public List<SkillPost> getRecentPosts() {
        return postRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<SkillPost> getPostsByUserIds(Set<String> userIds) {
        return postRepository.findByUserIdIn(userIds);
    }
}
