package com.example.skillxchange.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.skillxchange.backend.model.Like;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
   List<Like> findByPostId(String postId);

   Optional<Like> findByPostIdAndUserId(String postId, String userId);
   
}
