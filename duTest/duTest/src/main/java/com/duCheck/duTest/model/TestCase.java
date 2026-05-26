package com.duCheck.duTest.model;

import com.duCheck.duTest.model.enums.Priority;
import com.duCheck.duTest.model.enums.Status;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TestCase")
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String testCaseID;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
