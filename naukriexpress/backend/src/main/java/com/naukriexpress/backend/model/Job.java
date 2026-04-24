package com.naukriexpress.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "jobs")
public class Job {
    @Id
    private String id;
    private String companyName;
    private String role;
    private String location;
    private String description;
}