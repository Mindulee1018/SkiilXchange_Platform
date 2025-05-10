package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByTagsContainingIgnoreCase(String tag);
    List<LearningPlan> findByIsPublicTrue();
    List<LearningPlan> findByIsPublicTrueAndTagsContainingIgnoreCase(String tag);
    List<LearningPlan> findByUserIdAndIsPublicTrue(String userId);
    List<LearningPlan> findByUserIdInAndIsPublicTrue(Set<String> userIds);
    List<LearningPlan> findByTagsInIgnoreCaseAndIsPublicTrue(Set<String> tags);
    List<LearningPlan> findTop10ByIsPublicTrueOrderByCreatedAtDesc();
}
