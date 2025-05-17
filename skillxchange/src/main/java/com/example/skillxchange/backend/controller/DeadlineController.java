package com.example.skillxchange.backend.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.skillxchange.backend.model.Deadline;
import com.example.skillxchange.backend.repository.DeadlineRepository;

@RestController
@RequestMapping("/api/deadlines")
public class DeadlineController {
    @Autowired
    private DeadlineRepository deadlineRepository;

    // Get all upcoming deadlines for a specific user
    @GetMapping("/user/{userId}")
    public List<Deadline> getUserDeadlines(@PathVariable String userId) {
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.HOUR, 24);
        Date next24Hours = cal.getTime();

        // Get deadlines for user within next 24 hours that are not notified yet
        System.out.println("Now: " + now);
        System.out.println("Next 24h: " + next24Hours);
        System.out.println("Fetching deadlines for userId: '" + userId + "'");
        List<Deadline> result = deadlineRepository.findByUserId(userId);
        for (Deadline d : result) {
            System.out.println("Due: " + d.getDueDate() + ", Notified: " + d.isNotified());
        }
        System.out.println("Result: " + result.size());
        return result;
    }

    //mark as completed the deadlines
    @PatchMapping("/user/{userId}/mark-completed/{deadlineId}")

    public ResponseEntity<?> markDeadlineAsCompleted(@PathVariable String userId, @PathVariable String deadlineId) {
        Optional<Deadline> optionalDeadline = deadlineRepository.findByIdAndUserId(deadlineId,
                userId);

        if (optionalDeadline.isEmpty()) {
            return ResponseEntity.status(404).body("Deadline not found for this user.");
        }

        Deadline deadline = optionalDeadline.get();
        deadline.setCompleted(true);
        deadlineRepository.save(deadline);

        return ResponseEntity.ok("Deadline marked as completed.");
    }

}
