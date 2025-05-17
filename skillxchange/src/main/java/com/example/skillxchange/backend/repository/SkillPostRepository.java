package com.example.skillxchange.backend.repository;

import java.util.List;
import java.util.Set;

import com.example.skillxchange.backend.model.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    List<SkillPost> findByUserId(String userId);
    List<SkillPost> findTop10ByOrderByTimestampDesc();
    List<SkillPost> findByUserIdIn(Set<String> userIds);
}