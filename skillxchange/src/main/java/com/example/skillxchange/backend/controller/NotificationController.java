package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.Notification;
import com.example.skillxchange.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    // Get notifications by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        if (notifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(notifications);
    }

    // Delete notification by user ID and notification ID
    @DeleteMapping("/user/{userId}/delete/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable String userId,
            @PathVariable String notificationId) {

        Optional<Notification> optionalNotification = notificationRepository.findByIdAndUserId(notificationId, userId);

        if (optionalNotification.isEmpty()) {
            return ResponseEntity.status(404).body("Notification not found for this user.");
        }

        notificationRepository.deleteById(notificationId);

        return ResponseEntity.ok("Notification deleted successfully.");
    }

    @PatchMapping("/user/{userId}/mark-read/notificationId")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);

        if (optionalNotification.isEmpty()) {
            return ResponseEntity.status(404).body("Notification not found.");
        }

        Notification notification = optionalNotification.get();
        notification.setRead(true); // Use the actual field name from your model
        notificationRepository.save(notification);

        return ResponseEntity.ok("Notification marked as read.");
    }

}