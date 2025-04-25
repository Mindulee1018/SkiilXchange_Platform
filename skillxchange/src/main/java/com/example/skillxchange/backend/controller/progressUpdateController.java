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

    
    // GET /api/ProgressUpdate - Get progress updates (notifications) for logged-in user
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
}
