package com.duCheck.duTest.exception;
// use where data is not found
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
