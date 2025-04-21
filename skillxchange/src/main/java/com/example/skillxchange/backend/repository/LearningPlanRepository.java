package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByTagsContainingIgnoreCase(String tag);
    List<LearningPlan> findByIsPublicTrue();
    List<LearningPlan> findByIsPublicTrueAndTagsContainingIgnoreCase(String tag);
}
