package com.duCheck.duTest.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
//    for handling not matched resource
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handelResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request){
        ErrorResponse errorResponse= new ErrorResponse
                (LocalDateTime.now(),HttpStatus.NOT_FOUND.value(),"Not Found",ex.getMessage(),request.getRequestURI());
        return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
    }
//  for handling duplicate resource(test case id)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(DuplicateResourceException ex, HttpServletRequest request){
        ErrorResponse errorResponse = new ErrorResponse
                (LocalDateTime.now(),HttpStatus.CONFLICT.value(),"Conflict",ex.getMessage(),request.getRequestURI());
        return new ResponseEntity<>(errorResponse,HttpStatus.CONFLICT);
    }
    //  for handling if the project have any test cases and user try to delete that.
    @ExceptionHandler(ProjectNotEmptyException.class)
    public ResponseEntity<ErrorResponse> handleProjectNotEmpty(ProjectNotEmptyException ex, HttpServletRequest request){
        ErrorResponse errorResponse = new ErrorResponse
                (LocalDateTime.now(),HttpStatus.CONFLICT.value(),"Conflict",ex.getMessage(),request.getRequestURI());
        return new ResponseEntity<>(errorResponse,HttpStatus.CONFLICT);
    }
//    for unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex,HttpServletRequest request){
        ErrorResponse errorResponse = new ErrorResponse
                (LocalDateTime.now(),HttpStatus.INTERNAL_SERVER_ERROR.value(),"Internal Server Error",
                        ex.getMessage(),request.getRequestURI());
        return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
