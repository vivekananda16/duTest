package com.duCheck.duTest.exception;

public class ProjectNotEmptyException extends RuntimeException{
    public ProjectNotEmptyException(String message){
        super(message);
    }
}
