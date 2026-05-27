package com.duCheck.duTest.repository;

import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long>, JpaSpecificationExecutor<TestCase> {
    boolean existsByTestCaseID(String testCaseID);
    boolean existsByTestCaseIDAndIdNot(String testCaseID, Long id);
    //    for total active + high priority across ALL records we are adding a countBy methode with long RT.
    long countByStatus(Status status);
    long countByPriority(Priority priority);
}
