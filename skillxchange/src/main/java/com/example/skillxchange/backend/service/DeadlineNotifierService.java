package com.example.skillxchange.backend.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.skillxchange.backend.model.Deadline;
import com.example.skillxchange.backend.repository.DeadlineRepository;
import com.example.skillxchange.backend.service.NotificationPublisher;

@Service
public class DeadlineNotifierService {

    @Autowired
    private DeadlineRepository deadlineRepository;

    @Autowired
    private NotificationPublisher notificationPublisher;

    // Run every hour
    @Scheduled(cron = "0 0 * * * *")
    public void notifyUpcomingDeadlines() {
        Date now = new Date();

        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.HOUR, 24);
        Date next24Hours = cal.getTime();

        List<Deadline> upcomingDeadlines = deadlineRepository
                .findByDueDateBetweenAndNotifiedFalse(now, next24Hours);

        for (Deadline deadline : upcomingDeadlines) {
            // Send notification
            String message = "Reminder: Your task \"" + deadline.getTaskTitle() + "\" is due within 24 hours!";
            notificationPublisher.sendDeadlineNotification(deadline.getUserId(), message);

            // Mark as notified
            deadline.setNotified(true);
            deadline.setNotificationMessage(message);
            deadlineRepository.save(deadline);
        }
    }
    
}
