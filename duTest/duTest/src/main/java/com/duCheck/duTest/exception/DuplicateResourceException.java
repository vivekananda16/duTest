package com.duCheck.duTest.exception;
//use when duplicate testcaseID found
public class DuplicateResourceException extends RuntimeException{
    public DuplicateResourceException(String message){
        super(message);
    }
}
