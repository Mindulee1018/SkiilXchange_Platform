package com.example.skillxchange.backend.controller;

import com.example.skillxchange.backend.dto.LearningPlanDTO;
import com.example.skillxchange.backend.model.LearningPlan;
import com.example.skillxchange.backend.model.ProgressUpdate;
import com.example.skillxchange.backend.repository.LearningPlanRepository;
import com.example.skillxchange.backend.repository.ProgressUpdateRepository;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.service.AchievementService;
import com.example.skillxchange.backend.service.NotificationPublisher;
//import com.example.skillxchange.backend.service.NotificationService;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.skillxchange.backend.model.Task;

@RestController
@RequestMapping("/api")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementService achievementService;

    //create plan


    @Autowired
    private NotificationPublisher notificationPublisher;

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    private ProgressUpdate saveProgressUpdate(String userId, String planId, String type, String message) {
        ProgressUpdate update = new ProgressUpdate(userId, planId, type, message);
        progressUpdateRepository.save(update);
        return update;
    }
    

    @PostMapping("/learning-plans")
    public ResponseEntity<?> createLearningPlan(@RequestBody @Valid LearningPlanDTO planDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        int totalTaskDuration = planDto.getTasks().stream().mapToInt(Task::getDurationInDays).sum();
        if (totalTaskDuration != planDto.getLearningPeriodInDays()) {
            return ResponseEntity.badRequest().body("Total task duration must equal the learning period.");
        }

        LearningPlan plan = new LearningPlan();
        plan.setTitle(planDto.getTitle());
        plan.setDescription(planDto.getDescription());
        plan.setTags(planDto.getTags());
        plan.setSkill(planDto.getSkill());
        plan.setTasks(planDto.getTasks());
        plan.setisPublic(planDto.getisPublic());
        plan.setUserId(user.getId());
        plan.setLearningPeriodInDays(planDto.getLearningPeriodInDays());

        learningPlanRepository.save(plan);

        int userPlanCount = (int) learningPlanRepository.countByUserId(user.getId());
        achievementService.checkAndAwardAchievements(user.getId(), "plan_created", userPlanCount);


        ProgressUpdate update = saveProgressUpdate(user.getId(), plan.getId(), "CREATE", "Created plan: " + plan.getTitle());
        notificationPublisher.sendPlanNotification(update);

        return ResponseEntity.ok(plan);
    }

    //get all plans
    @GetMapping("/learning-plans")
    public ResponseEntity<?> getUserLearningPlans() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(learningPlanRepository.findByUserId(user.getId()));
    }

    //get plan by id
    @GetMapping("/learning-plans/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable String id) {
        return learningPlanRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Plan not found"));
    }

    //delete learning plan
    @DeleteMapping("/learning-plans/{id}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<LearningPlan> planOpt = learningPlanRepository.findById(id);
        if (planOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = planOpt.get();
        if (!plan.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this plan");
        }

        learningPlanRepository.deleteById(id);

        ProgressUpdate update = saveProgressUpdate(user.getId(), plan.getId(), "DELETE", "Deleted plan: " + plan.getTitle());
        notificationPublisher.sendPlanNotification(update);

        return ResponseEntity.ok("Learning plan deleted successfully");
    }
    
    //update learning plan
    @PutMapping("/learning-plans/{id}")
    public ResponseEntity<?> updateLearningPlan(@PathVariable String id, @RequestBody @Valid LearningPlanDTO updatedPlan) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<LearningPlan> existingPlanOpt = learningPlanRepository.findById(id);
        if (existingPlanOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Learning plan not found");
        }

        LearningPlan plan = existingPlanOpt.get();
        if (!plan.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to update this plan");
        }

        plan.setTitle(updatedPlan.getTitle());
        plan.setDescription(updatedPlan.getDescription());
        plan.setTags(updatedPlan.getTags());
        plan.setSkill(updatedPlan.getSkill());
        plan.setTasks(updatedPlan.getTasks());
        plan.setisPublic(updatedPlan.getisPublic());

        learningPlanRepository.save(plan);

        ProgressUpdate update = saveProgressUpdate(user.getId(), plan.getId(), "UPDATE", "Updated plan: " + plan.getTitle());
        notificationPublisher.sendPlanNotification(update);

        return ResponseEntity.ok(plan);
    }
    
    //get plans by tag
    @GetMapping("/learning-plans/tag/{tag}")
    public ResponseEntity<?> getPlansByTag(@PathVariable String tag) {
        List<LearningPlan> plans = learningPlanRepository.findByTagsContainingIgnoreCase(tag);
        return ResponseEntity.ok(plans);
    }
    
    //get all public plans
    @GetMapping("/learning-plans/public")
    public ResponseEntity<?> getPublicPlans() {
        return ResponseEntity.ok(learningPlanRepository.findByIsPublicTrue());
    }
    //get public plans using a certain tag

    @GetMapping("/learning-plans/public/tag/{tag}")
    public ResponseEntity<?> getPublicPlansByTag(@PathVariable String tag) {
        return ResponseEntity.ok(
                learningPlanRepository.findByIsPublicTrueAndTagsContainingIgnoreCase(tag));
    }
    
    //mark task as complete
    @PatchMapping("/learning-plans/{planId}/tasks/{taskIndex}/complete")
    public ResponseEntity<?> markTaskCompleted(@PathVariable String planId, @PathVariable int taskIndex) {
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(planId);
        if (planOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Plan not found");
        }

        LearningPlan plan = planOpt.get();
        List<Task> tasks = plan.getTasks();
        if (taskIndex < 0 || taskIndex >= tasks.size()) {
            return ResponseEntity.status(400).body("Invalid task index");
        }

        Task task = tasks.get(taskIndex);
        task.setCompleted(true);
        task.setCompletedAt(new java.util.Date());
        plan.setTasks(tasks);

        // Check if all tasks are completed
        boolean allCompleted = tasks.stream().allMatch(Task::isCompleted);
        plan.setCompleted(allCompleted);
        //plan.setTasks(tasks);

        learningPlanRepository.save(plan);

        String userId = plan.getUserId();
        String message = "Completed task: " + task.getTitle() + " in plan: " + plan.getTitle();
        ProgressUpdate update = new ProgressUpdate(userId, plan.getId(), "UPDATE", message);
        progressUpdateRepository.save(update);
        notificationPublisher.sendPlanNotification(update);

        // Count completed tasks in all plans by the user
        List<LearningPlan> userPlans = learningPlanRepository.findByUserId(plan.getUserId());
        int completedTaskCount = userPlans.stream()
            .flatMap(p -> p.getTasks().stream())
            .filter(Task::isCompleted)
            .toList()
            .size();

        achievementService.checkAndAwardAchievements(plan.getUserId(), "task_completed", completedTaskCount);

        // Also check if plan is completed
        if (allCompleted) {
            List<LearningPlan> completedPlans = userPlans.stream()
                .filter(LearningPlan::isCompleted)
                .toList();

            achievementService.checkAndAwardAchievements(plan.getUserId(), "plan_completed", completedPlans.size());
        }
        return ResponseEntity.ok("Task marked as completed" + (allCompleted ? ". Plan completed!" : ""));
    }
    
    //mark the task as incomplete
    @PatchMapping("/learning-plans/{planId}/tasks/{taskIndex}/incomplete")
    public ResponseEntity<?> markTaskIncomplete(@PathVariable String planId, @PathVariable int taskIndex) {
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(planId);
        if (planOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan not found");
        }

        LearningPlan plan = planOpt.get();
        if (taskIndex < 0 || taskIndex >= plan.getTasks().size()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid task index");
        }

        plan.getTasks().get(taskIndex).setCompleted(false);
        plan.getTasks().get(taskIndex).setCompletedAt(null);
        learningPlanRepository.save(plan);

        return ResponseEntity.ok().build();
    }

    //returning public plans by the user
    @GetMapping("/learning-plans/user/public")
    public ResponseEntity<?> getMyPublicPlans(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userId = userOpt.get().getId();
        List<LearningPlan> publicPlans = learningPlanRepository.findByUserIdAndIsPublicTrue(userId);
        return ResponseEntity.ok(publicPlans);
    }
    

    // Start Plan
    @PostMapping("/learning-plans/{id}/start")
    public ResponseEntity<?> startPlan(@PathVariable String id, Principal principal) {
        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userOpt.get();
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(id);
        if (planOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Learning plan not found");
        }

        LearningPlan plan = planOpt.get();
        if (!plan.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to start this plan");
        }

        // Start the plan
        plan.setStarted(true);
        learningPlanRepository.save(plan);

        ProgressUpdate update = saveProgressUpdate(user.getId(), plan.getId(), "STARTED", "Started plan: " + plan.getTitle());
        notificationPublisher.sendPlanNotification(update);

        return ResponseEntity.ok("Plan started successfully");
    }

    @GetMapping("/learning-plans/foryou")
    public ResponseEntity<?> getForYouFeed(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        User user = userOpt.get();

        // Plans by followed users
        List<LearningPlan> followedUserPlans = learningPlanRepository
                .findByUserIdInAndIsPublicTrue(user.getFollowingIds());

        // Plans by followed tags
        List<LearningPlan> tagPlans = learningPlanRepository
                .findByTagsInIgnoreCaseAndIsPublicTrue(user.getFollowedTags());

        // Recent public plans
        List<LearningPlan> recentPlans = learningPlanRepository
                .findTop10ByIsPublicTrueOrderByCreatedAtDesc();

        // Combine all, removing duplicates
        Set<LearningPlan> combined = new LinkedHashSet<>();
        combined.addAll(followedUserPlans);
        combined.addAll(tagPlans);
        combined.addAll(recentPlans);

        return ResponseEntity.ok(combined);
    }


}
