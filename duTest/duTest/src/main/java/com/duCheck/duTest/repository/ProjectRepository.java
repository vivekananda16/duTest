package com.duCheck.duTest.repository;

import com.duCheck.duTest.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByProjectName(String projectName);
}
