package com.naukriexpress.backend.repository;

import com.naukriexpress.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // This custom method will help us find the user by just their name
    Optional<User> findByUsername(String username);
}