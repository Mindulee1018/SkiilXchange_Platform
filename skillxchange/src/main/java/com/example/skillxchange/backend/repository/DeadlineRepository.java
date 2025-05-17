package com.example.skillxchange.backend.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.skillxchange.backend.model.Deadline;

@Repository
public interface DeadlineRepository extends MongoRepository<Deadline, String> {
    
    // Find deadlines within the next 24 hours and not yet notified
    List<Deadline> findByDueDateBetweenAndNotifiedFalse(Date from, Date to);
    List<Deadline> findByUserIdAndDueDateBetweenAndNotifiedFalse(String userId, Date start, Date end);
    List<Deadline> findByUserId(String userId);
    Optional<Deadline> findByIdAndUserId(Long id, String userId);
}
