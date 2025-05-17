package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Deadline;
import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.model.ProgressUpdate;
import com.example.skillxchange.backend.model.UserSettings;
import com.example.skillxchange.backend.repository.DeadlineRepository;
import com.example.skillxchange.backend.repository.NotificationRepository;
import com.example.skillxchange.backend.repository.ProgressUpdateRepository;
import com.example.skillxchange.backend.repository.UserSettingsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private DeadlineRepository deadlineRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    // Get notifications by user ID
    // @GetMapping("/user/{userId}")
    // public ResponseEntity<List<Notification>>
    // getNotificationsByUserId(@PathVariable String userId) {
    // List<Notification> notifications =
    // notificationRepository.findByUserId(userId);
    // if (notifications.isEmpty()) {
    // return ResponseEntity.noContent().build();
    // }
    // return ResponseEntity.ok(notifications);
    // }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Object>> getNotificationsByUserId(@PathVariable String userId) {
        Optional<UserSettings> optionalSettings = userSettingsRepository.findByUserId(userId);

        if (optionalSettings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        UserSettings settings = optionalSettings.get();
        List<Object> allNotifications = new ArrayList<>();

        if (settings.isCommentNotifications() || settings.isLikeNotifications()) {
            List<Notification> notifList = notificationRepository.findByUserId(userId);

            List<Notification> filteredNotif = notifList.stream()
                    .filter(n -> (n.getType().equals("COMMENT") && settings.isCommentNotifications()) ||
                            (n.getType().equals("LIKE") && settings.isLikeNotifications()))
                    .toList();

            allNotifications.addAll(filteredNotif);
        }

        if (settings.isProgressUpdateNotifications()) {
            List<ProgressUpdate> progressUpdates = progressUpdateRepository.findByUserIdOrderByTimestampDesc(userId);
            allNotifications.addAll(progressUpdates);
        }

        if (settings.isDeadlineNotifications()) {
            List<Deadline> deadlines = deadlineRepository.findByUserId(userId);
            allNotifications.addAll(deadlines);
        }

        if (allNotifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(allNotifications);
    }

}
