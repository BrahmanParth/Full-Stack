package com.naukriexpress.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;

    private List<Application> applications = new ArrayList<>();

    @Data
    public static class Application {
        private String companyName;
        private String role;
        private Date dateApplied = new Date();
        private String status = "Applied";
    }
}