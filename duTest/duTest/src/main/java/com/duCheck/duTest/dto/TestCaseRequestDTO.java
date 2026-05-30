package com.duCheck.duTest.dto;

import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseRequestDTO {
    private String testCaseID;
    private String name;
    private String description;
    private Status status;
    private Priority priority;
    private Long projectId;
}
