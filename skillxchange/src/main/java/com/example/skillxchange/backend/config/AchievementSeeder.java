package com.example.skillxchange.backend.config;

import com.example.skillxchange.backend.model.Achievement;
import com.example.skillxchange.backend.model.Achievement.Condition;
import com.example.skillxchange.backend.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class AchievementSeeder implements CommandLineRunner {

    @Autowired
    private AchievementRepository achievementRepository;

    @Override
    public void run(String... args) {
        List<Achievement> initialAchievements = Arrays.asList(
            new Achievement("PLAN_CREATED_1", "First Plan Created", "Create your first learning plan", "learning_plan", new Condition("plan_created", 1), "📘"),
            new Achievement("PLAN_COMPLETED_1", "First Plan Completed", "Complete a learning plan", "learning_plan", new Condition("plan_completed", 1), "✅"),
            new Achievement("TASK_COMPLETED_5", "Task Master", "Complete 5 tasks", "learning_plan", new Condition("task_completed", 5), "📝"),
            new Achievement("STREAK_3_DAYS", "3-Day Streak", "Complete tasks 3 days in a row", "learning_plan", new Condition("streak_days_completed", 3), "🔥"),
            new Achievement("POST_CREATED_1", "First Skill Shared", "Share your first skill post", "skill_post", new Condition("skill_post_created", 1), "📤")
        );

        for (Achievement ach : initialAchievements) {
            if (achievementRepository.findByCode(ach.getCode()).isEmpty()) {
                achievementRepository.save(ach);
                System.out.println("Seeded achievement: " + ach.getCode());
            }
        }
    }
}