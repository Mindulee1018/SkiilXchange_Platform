package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.model.ProgressUpdate;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.ProgressUpdateRepository;
import com.example.skillxchange.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class progressUpdateController {
    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    // GET /api/ProgressUpdate - Get progress updates (notifications) for logged-in
    // user
    // GET /api/progress-update - Get progress updates (notifications) for logged-in
    // user
    @GetMapping("/ProgressUpdate")
    public ResponseEntity<?> getProgressUpdatesForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<ProgressUpdate> updates = progressUpdateRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(updates);
    }

    // POST /api/progress-update - Post a new progress update for the logged-in user
    @PostMapping("/ProgressUpdate")
    public ResponseEntity<?> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        progressUpdate.setUserId(user.getId());
        progressUpdateRepository.save(progressUpdate);
        return ResponseEntity.ok("Progress update saved successfully.");
    }

    // GET /api/progress/{planId} - Get progress updates by planId
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/progress/{planId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressByPlanId(@PathVariable String planId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByPlanId(planId);

        if (updates.isEmpty()) {
            return ResponseEntity.status(404).body(null); // No updates found
        }

        return ResponseEntity.ok(updates);
    }

    @PatchMapping("/ProgressUpdate/{id}/mark-read")
    public ResponseEntity<?> markProgressUpdateAsRead(@PathVariable String id) {
        ProgressUpdate update = progressUpdateRepository.findById(id).orElse(null);

        if (update == null) {
            return ResponseEntity.status(404).body("Progress update not found.");
        }

        update.setRead(true);
        progressUpdateRepository.save(update);

        return ResponseEntity.ok("Progress update marked as read.");
    }

    @PatchMapping("/progress-updates/mark-all-read")
    public ResponseEntity<?> markAllAsReadForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<ProgressUpdate> updates = progressUpdateRepository.findByUserIdOrderByTimestampDesc(user.getId());
        updates.forEach(update -> {
            if (!update.isRead()) {
                update.setRead(true);
            }
        });
        progressUpdateRepository.saveAll(updates);
        return ResponseEntity.ok("All updates marked as read.");
    }

}