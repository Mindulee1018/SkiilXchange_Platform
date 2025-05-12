package com.example.skillxchange.backend.repository;

import com.example.skillxchange.backend.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    Optional<Achievement> findByCode(String code);
}

