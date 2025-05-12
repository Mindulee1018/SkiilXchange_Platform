package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.LearningPlan;
import com.example.skillxchange.backend.model.ProgressUpdate;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.LearningPlanRepository;
import com.example.skillxchange.backend.repository.ProgressUpdateRepository;
import com.example.skillxchange.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private NotificationPublisher notificationPublisher;

    public void startPlan(String planId, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(planId);

        if (userOpt.isEmpty() || planOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid user or plan ID");
        }

        User user = userOpt.get();
        LearningPlan plan = planOpt.get();

        // Save progress update
        ProgressUpdate update = new ProgressUpdate(
            user.getId(),
            plan.getId(),
            "START",
            "Started plan: " + plan.getTitle()
        );
        progressUpdateRepository.save(update);

        // Send WebSocket notification
        notificationPublisher.sendPlanNotification(update);
    }
}