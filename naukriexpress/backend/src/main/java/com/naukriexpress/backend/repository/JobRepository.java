package com.naukriexpress.backend.repository;

import com.naukriexpress.backend.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<Job, String> {
}