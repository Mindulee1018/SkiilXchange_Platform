package com.example.skillxchange.backend.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
        return deadlineRepository.findByUserIdAndDueDateBetweenAndNotifiedFalse(userId, now, next24Hours);
    }
}
