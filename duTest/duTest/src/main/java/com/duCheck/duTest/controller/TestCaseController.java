package com.duCheck.duTest.controller;

import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import com.duCheck.duTest.service.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testcases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TestCaseController {
    private final TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<TestCase> createTestCase(@RequestBody TestCase testCase){
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseService.createTestCase(testCase));
    }
    @GetMapping
    public ResponseEntity<Page<TestCase>> getAllTestCase(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "6") int size){
        return ResponseEntity.ok(testCaseService.getAllTestCases(page, size));
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
                                                         @RequestParam(defaultValue = "0")int page,
                                                         @RequestParam(defaultValue = "6")int size){
        return ResponseEntity.ok(testCaseService.searchTestCase(keyword, status, priority, page, size));
    }
}
