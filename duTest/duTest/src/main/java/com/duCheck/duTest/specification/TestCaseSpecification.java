package com.duCheck.duTest.specification;

import com.duCheck.duTest.model.Project;
import com.duCheck.duTest.model.TestCase;
import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import org.springframework.data.jpa.domain.Specification;

public class TestCaseSpecification {
    public static Specification<TestCase> searchAndFilter(String keyword, Status status, Priority priority, Long projectId){
        return ((root, query, cb) ->{
//            start with empty condition
            var predicate= cb.conjunction();
//            if we write something in searchbar then this will work
            if(keyword != null && !keyword.isBlank()){
                String searchValue= "%"+keyword.toLowerCase()+"%";
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("testCaseID")),searchValue),
                        cb.like(cb.lower(root.get("name")),searchValue)
                        )
                );
            }
//             if user choose status then it will work
            if (status != null){
                predicate = cb.and(predicate,
                        cb.equal(root.get("status"),status)
                );
            }
//            if user choose priority then it will work
            if(priority != null){
                predicate = cb.and(predicate,
                        cb.equal(root.get("priority"),priority)
                );
            }

            if (projectId != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("project").get("id"), projectId)
                );
            }

            return predicate;
        } );
    }
}