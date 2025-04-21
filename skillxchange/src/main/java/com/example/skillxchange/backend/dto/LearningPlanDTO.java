package com.example.skillxchange.backend.dto;

import com.example.skillxchange.backend.model.Task;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class LearningPlanDTO {

    @NotBlank
    private String title;

    private String description;

    private List<String> tags;

    private String skill;

    private List<Task> tasks;

    private boolean isPublic;

    private int learningPeriodInDays;


    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Boolean getisPublic() { return isPublic; }
    public void setisPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public int getLearningPeriodInDays() { return learningPeriodInDays; }
    public void setLearningPeriodInDays(int learningPeriodInDays) { this.learningPeriodInDays = learningPeriodInDays; }
}
