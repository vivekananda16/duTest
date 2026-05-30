package com.duCheck.duTest.service.impl;

import com.duCheck.duTest.dto.TestCaseRequestDTO;
import com.duCheck.duTest.exception.DuplicateResourceException;
import com.duCheck.duTest.exception.ResourceNotFoundException;
import com.duCheck.duTest.model.Project;
import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import com.duCheck.duTest.repository.ProjectRepository;
import com.duCheck.duTest.repository.TestCaseRepository;
import com.duCheck.duTest.service.TestCaseService;
import com.duCheck.duTest.specification.TestCaseSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {
    private final TestCaseRepository testCaseRepository;
    private final ProjectRepository projectRepository;

    @Override
    public TestCase createTestCase(TestCaseRequestDTO requestDTO) {
        if(testCaseRepository.existsByTestCaseID(requestDTO.getTestCaseID())){
            throw new DuplicateResourceException("testCaseID already exists."+requestDTO.getTestCaseID());
        }
        Project project=projectRepository.findById(requestDTO.getProjectId())
                .orElseThrow(()->new ResourceNotFoundException("project not found with id: "+ requestDTO.getProjectId())
        );
      TestCase testCase= TestCase.builder().testCaseID(requestDTO.getTestCaseID())
              .name(requestDTO.getName()).description(requestDTO.getDescription())
              .status(requestDTO.getStatus()).priority(requestDTO.getPriority())
              .project(project).build();
      return testCaseRepository.save(testCase);
    }

    @Override
    public Page<TestCase> getAllTestCases(Long projectId, int page, int size) {
        Pageable pageable= PageRequest.of(page, size);
        return testCaseRepository.findAll(TestCaseSpecification.searchAndFilter(null,null,null,projectId),pageable);
    }

    @Override
    public TestCase getTestCaseById(Long id) {
        return testCaseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("no testcase exist with id: "+id));
    }

    @Override
    public TestCase updateTestCase(Long id, TestCase updatedTestCase) {
        TestCase existingTestCase= getTestCaseById(id);

        if(updatedTestCase.getTestCaseID() != null){
            if(testCaseRepository.existsByTestCaseIDAndIdNot(updatedTestCase.getTestCaseID(),id)){
                throw new DuplicateResourceException("TestCaseID already exists "+ updatedTestCase.getTestCaseID());
            }
            existingTestCase.setTestCaseID(updatedTestCase.getTestCaseID());
        }
        if(updatedTestCase.getName() != null){
            existingTestCase.setName(updatedTestCase.getName());
        }
        if(updatedTestCase.getDescription() != null){
            existingTestCase.setDescription(updatedTestCase.getDescription());
        }
        if(updatedTestCase.getStatus() != null){
            existingTestCase.setStatus(updatedTestCase.getStatus());
        }
        if(updatedTestCase.getPriority() != null){
            existingTestCase.setPriority(updatedTestCase.getPriority());
        }
        return testCaseRepository.save(existingTestCase);
    }

    @Override
    public void deleteTestCase(Long id) {
        TestCase existingTestCase= getTestCaseById(id);
        testCaseRepository.delete(existingTestCase);
    }

    @Override
    public Page<TestCase> searchTestCase(String keyword, Status status, Priority priority,Long projectId, int page, int size) {
        Pageable pageable=PageRequest.of(page,size);
        return testCaseRepository.findAll(TestCaseSpecification.searchAndFilter(keyword, status, priority, projectId), pageable);
    }

    @Override
    public long getActiveTestCount(Long projectId) {
        return testCaseRepository.countByStatusAndProjectId(Status.ACTIVE, projectId);
    }

    @Override
    public long getHighPriorityTestCount(Long projectId) {
        return testCaseRepository.countByPriorityAndProjectId(Priority.HIGH, projectId);
    }
}
