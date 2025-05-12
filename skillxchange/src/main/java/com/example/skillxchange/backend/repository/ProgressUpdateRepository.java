package com.example.skillxchange.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.skillxchange.backend.model.ProgressUpdate;

public interface  ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserIdOrderByTimestampDesc(String userId);
    List<ProgressUpdate> findByPlanId(String planId);
}