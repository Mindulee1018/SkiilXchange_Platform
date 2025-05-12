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

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/progress-update")
public class progressUpdateController {
    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    // GET /api/ProgressUpdate - Get progress updates (notifications) for logged-in
    // user
    // GET /api/progress-update - Get progress updates (notifications) for logged-in
    // user
    @GetMapping
    public ResponseEntity<?> getProgressUpdatesForCurrentUser(Authentication authentication) {
        // Authentication authentication =
        // SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<ProgressUpdate> updates = progressUpdateRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(updates);
    }

    // POST /api/progress-update - Post a new progress update for the logged-in user
    @PostMapping
    public ResponseEntity<?> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        progressUpdate.setUserId(user.getId());
        progressUpdate.setTimestamp(new Date());
        progressUpdateRepository.save(progressUpdate);
        return ResponseEntity.ok("Progress update saved successfully.");
    }

    // GET /api/progress/{planId} - Get progress updates by planId
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{planId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressByPlanId(@PathVariable String planId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByPlanId(planId);

        if (updates.isEmpty()) {
            return ResponseEntity.status(404).body(null); // No updates found
        }

        return ResponseEntity.ok(updates);
    }

    // GET /api/progress-update/notifications - Show only create, update, delete,
    // completed updates
    @GetMapping("/notifications")
    public ResponseEntity<?> getFilteredPlanProgressNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<ProgressUpdate> allUpdates = progressUpdateRepository.findByUserIdOrderByTimestampDesc(user.getId());

        // Filter only CREATE, UPDATE, DELETE, COMPLETED
        List<ProgressUpdate> filteredUpdates = allUpdates.stream()
                .filter(update -> List.of("CREATE", "UPDATE", "DELETE", "COMPLETED").contains(update.getType()))
                .toList();

        return ResponseEntity.ok(filteredUpdates);
    }

}
