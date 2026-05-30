package com.duCheck.duTest.controller;

import com.duCheck.duTest.dto.TestCaseRequestDTO;
import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import com.duCheck.duTest.service.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/testcases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TestCaseController {
    private final TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<TestCase> createTestCase(@PathVariable Long projectId,@RequestBody TestCaseRequestDTO requestDTO){
        requestDTO.setProjectId(projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseService.createTestCase(requestDTO));
    }
    @GetMapping
    public ResponseEntity<Page<TestCase>> getAllTestCase(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "6") int size,
                                                         @PathVariable Long projectId){
        return ResponseEntity.ok(testCaseService.getAllTestCases(projectId,page, size));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TestCase> getTestCaseById(@PathVariable Long id){
        return ResponseEntity.ok(testCaseService.getTestCaseById(id));
    }
    @PatchMapping("/{id}")
    public ResponseEntity<TestCase> updateTestCase(@PathVariable Long id,@RequestBody TestCase testCase){
        return ResponseEntity.ok(testCaseService.updateTestCase(id,testCase));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTestcase(@PathVariable Long id){
        testCaseService.deleteTestCase(id);
        return ResponseEntity.ok("test case got deleted");
    }
    @GetMapping("/search")
    public ResponseEntity<Page<TestCase>> searchTestCase(@RequestParam(required = false) String keyword,
                                                         @RequestParam(required = false)Status status,
                                                         @RequestParam(required = false)Priority priority,
                                                         @PathVariable Long projectId,
                                                         @RequestParam(defaultValue = "0")int page,
                                                         @RequestParam(defaultValue = "6")int size){
        return ResponseEntity.ok(testCaseService.searchTestCase(keyword, status, priority, projectId, page, size));
    }
     @GetMapping("/count/active")
    public ResponseEntity<Long> getActiveTestCaseCount(@PathVariable Long projectId){
        return ResponseEntity.ok(testCaseService.getActiveTestCount(projectId));
     }
     @GetMapping("/count/high")
    public ResponseEntity<Long> getHighPriorityTestCaseCount(@PathVariable Long projectId){
        return ResponseEntity.ok(testCaseService.getHighPriorityTestCount(projectId));
     }
}
