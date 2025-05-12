package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.UserAchievement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends MongoRepository<UserAchievement, String> {
    List<UserAchievement> findByUserId(String userId);
    Optional<UserAchievement> findByUserIdAndAchievementCode(String userId, String achievementCode);
}
