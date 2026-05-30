package com.duCheck.duTest.service.impl;

import com.duCheck.duTest.exception.DuplicateResourceException;
import com.duCheck.duTest.exception.ProjectNotEmptyException;
import com.duCheck.duTest.exception.ResourceNotFoundException;
import com.duCheck.duTest.model.Project;
import com.duCheck.duTest.repository.ProjectRepository;
import com.duCheck.duTest.repository.TestCaseRepository;
import com.duCheck.duTest.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final TestCaseRepository testCaseRepository;

    @Override
    public Project createProject(Project project) {
        if (projectRepository.existsByProjectName(project.getProjectName())){
            throw  new DuplicateResourceException("Project already exists with the name: "+project.getProjectName());
        }
        return projectRepository.save(project);
    }

    @Override
    public Page<Project> getAllProjects(int page, int size) {
        Pageable pageable= PageRequest.of(page, size);
        return projectRepository.findAll(pageable);
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No project available with id: "+id));
    }

    @Override
    public void deleteProject(Long id) {
        Project existingProject=getProjectById(id);
        if(testCaseRepository.existsByProjectId(id)){
            throw new ProjectNotEmptyException("Project still have testcases, delete testcases before deleting project.");
        }
        projectRepository.delete(existingProject);
    }
}
