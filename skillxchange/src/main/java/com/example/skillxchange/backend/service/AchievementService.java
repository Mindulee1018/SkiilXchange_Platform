package com.example.skillxchange.backend.service;

import com.example.skillxchange.backend.model.Achievement;
import com.example.skillxchange.backend.model.UserAchievement;
import com.example.skillxchange.backend.repository.AchievementRepository;
import com.example.skillxchange.backend.repository.UserAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    /** Tries to award an achievement based on an action and user's current progress
      @param userId //ID of the user performing the action
      @param action //The action type (e.g. "plan_created", "task_completed")
      @param userActionCount //How many times the user has done this action
     */
    public void checkAndAwardAchievements(String userId, String action, int userActionCount) {
        List<Achievement> matchingAchievements = achievementRepository.findAll()
            .stream()
            .filter(a -> a.getCondition().getAction().equals(action) &&
                         userActionCount >= a.getCondition().getCount())
            .toList();

        for (Achievement ach : matchingAchievements) {
            boolean alreadyHas = userAchievementRepository
                .findByUserIdAndAchievementCode(userId, ach.getCode())
                .isPresent();

            if (!alreadyHas) {
                UserAchievement userAchievement = new UserAchievement(userId, ach.getCode());
                userAchievement.setAchievedAt(Instant.now());
                userAchievementRepository.save(userAchievement);
                System.out.println("Achievement awarded to user " + userId + ": " + ach.getCode());
            }
        }
    }

    public List<UserAchievement> getUserAchievements(String userId) {
        return userAchievementRepository.findByUserId(userId);
    }
}