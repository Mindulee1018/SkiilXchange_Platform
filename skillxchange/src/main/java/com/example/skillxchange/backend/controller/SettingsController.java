package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.UserSettings;
import com.example.skillxchange.backend.repository.UserSettingsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    @Autowired
    private UserSettingsRepository settingsRepository;

    // Get user settings
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSettings(@PathVariable String userId) {
        return ResponseEntity.ok(settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserSettings defaultSettings = new UserSettings();
                    defaultSettings.setUserId(userId);
                    return settingsRepository.save(defaultSettings);
                }));
    }

    // Update user settings
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserSettings(@PathVariable String userId, @RequestBody UserSettings updated) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    updated.setUserId(userId);
                    return updated;
                });

        settings.setCommentNotifications(updated.isCommentNotifications());
        settings.setLikeNotifications(updated.isLikeNotifications());
        settings.setProgressUpdateNotifications(updated.isProgressUpdateNotifications());
        settings.setDeadlineNotifications(updated.isDeadlineNotifications());

        return ResponseEntity.ok(settingsRepository.save(settings));
    }
}
