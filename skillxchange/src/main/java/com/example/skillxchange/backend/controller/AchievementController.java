package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Achievement;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.model.UserAchievement;
import com.example.skillxchange.backend.repository.AchievementRepository;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @GetMapping("/earned")
    public ResponseEntity<?> getEarnedAchievements(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        List<UserAchievement> earned = achievementService.getUserAchievements(user.getId());
        return ResponseEntity.ok(earned);
    }

    @GetMapping("/to-be-earned")
    public ResponseEntity<?> getToBeEarnedAchievements(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        List<UserAchievement> earned = achievementService.getUserAchievements(user.getId());
        Set<String> earnedCodes = earned.stream()
                .map(UserAchievement::getAchievementCode)
                .collect(Collectors.toSet());

        List<Achievement> toBeEarned = achievementRepository.findAll()
                .stream()
                .filter(a -> !earnedCodes.contains(a.getCode()))
                .toList();

        return ResponseEntity.ok(toBeEarned);
    }
}
