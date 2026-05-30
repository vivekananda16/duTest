package com.duCheck.duTest.controller;

import com.duCheck.duTest.model.Project;
import com.duCheck.duTest.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ProjectController {
    private final ProjectService projectService;
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project){
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(project));
    }

    @GetMapping
    public ResponseEntity<Page<Project>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size ){
        return ResponseEntity.ok(projectService.getAllProjects(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id){
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully.");
    }
}
