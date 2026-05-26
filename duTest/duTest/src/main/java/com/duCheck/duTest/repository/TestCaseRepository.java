package com.duCheck.duTest.repository;

import com.duCheck.duTest.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long>, JpaSpecificationExecutor<TestCase> {
    boolean existsByTestCaseID(String testCaseID);
    boolean existsByTestCaseIDAndIdNot(String testCaseID, Long id);
}
