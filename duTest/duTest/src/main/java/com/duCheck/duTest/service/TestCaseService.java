package com.duCheck.duTest.service;
import com.duCheck.duTest.dto.TestCaseRequestDTO;
import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import org.springframework.data.domain.Page;

import java.util.List;

// this interface says that all these methods should be there in the implimentation class.
public interface TestCaseService {
    TestCase createTestCase(TestCaseRequestDTO requestDTO);
    Page<TestCase> getAllTestCases(Long projectId, int page,int size);
    TestCase getTestCaseById(Long id);
    TestCase updateTestCase(Long id, TestCase testCase);
    void deleteTestCase(Long id);
    Page<TestCase> searchTestCase(String keyword, Status status, Priority priority, Long projectId, int page, int size);
    long getActiveTestCount(Long projectId);
    long getHighPriorityTestCount(Long projectId);
}
