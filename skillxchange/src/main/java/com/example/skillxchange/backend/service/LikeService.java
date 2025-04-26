package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.Like;
import com.example.skillxchange.backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public Like createLike(Like like) {
        return likeRepository.save(like);
    }

    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public boolean deleteLikeById(String likeId) {
        Optional<Like> existingLike = likeRepository.findById(likeId);
        if (existingLike.isPresent()) {
            likeRepository.deleteById(likeId);
            return true;
        }
        return false;
    }

    //public Optional<Like> getLikeByPostAndUser(String postId, String userId) {
       // return likeRepository.findByPostIdAndUserId(postId, userId);
    //}
}
