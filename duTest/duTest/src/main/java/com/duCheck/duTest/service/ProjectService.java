package com.duCheck.duTest.service;

import com.duCheck.duTest.model.Project;
import org.springframework.data.domain.Page;

public interface ProjectService {
    Project createProject(Project project);
    Page<Project> getAllProjects(int page, int size);
    Project getProjectById(Long id);
    void deleteProject(Long id);
}
