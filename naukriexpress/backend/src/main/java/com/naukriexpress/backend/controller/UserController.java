package com.naukriexpress.backend.controller;

import com.naukriexpress.backend.model.Job;
import com.naukriexpress.backend.model.User;
import com.naukriexpress.backend.repository.JobRepository;
import com.naukriexpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    // --- USER ACTIONS ---

    @PostMapping("/login")
    public User login(@RequestBody String username) {
        String cleanUsername = username.replace("\"", "");
        return userRepository.findByUsername(cleanUsername)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(cleanUsername);
                    return userRepository.save(newUser);
                });
    }
    @PatchMapping("/{username}/status/{companyName}")
    public User updateStatus(@PathVariable String username, @PathVariable String companyName, @RequestBody String newStatus) {
        User user = userRepository.findByUsername(username).orElseThrow();
        String cleanStatus = newStatus.replace("\"", "");

        user.getApplications().stream()
                .filter(a -> a.getCompanyName().equalsIgnoreCase(companyName))
                .findFirst()
                .ifPresent(a -> a.setStatus(cleanStatus));

        return userRepository.save(user);
    }

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping("/{username}/apply/{jobId}")
    public User applyToJob(@PathVariable String username, @PathVariable String jobId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        boolean alreadyApplied = user.getApplications().stream()
                .anyMatch(a -> a.getCompanyName().equals(job.getCompanyName()));

        if (!alreadyApplied) {
            User.Application app = new User.Application();
            app.setCompanyName(job.getCompanyName());
            app.setRole(job.getRole());
            app.setDateApplied(new Date()); // Added real date storage
            user.getApplications().add(app);
        }
        return userRepository.save(user);
    }

    @DeleteMapping("/{username}/revoke/{companyName}")
    public User revokeApplication(@PathVariable String username, @PathVariable String companyName) {
        User user = userRepository.findByUsername(username).orElseThrow();
        user.getApplications().removeIf(a -> a.getCompanyName().equals(companyName));
        return userRepository.save(user);
    }

    // --- ADMIN ACTIONS (Simple implementation) ---

    @PostMapping("/admin/add-job")
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    // Helper to pre-fill data (Run this once or via Postman)
    @PostMapping("/admin/setup-defaults")
    public String setupDefaults() {
        if(jobRepository.count() == 0) {
            String[][] companies = {
                    {"Google", "SDE Intern", "Bangalore"},
                    {"Microsoft", "Software Engineer II", "Hyderabad"},
                    {"Accenture", "Associate Software Engineer", "Chandigarh"},
                    {"Blinkit", "Backend Developer", "Gurgaon"},
                    {"Zomato", "Product Design Intern", "Delhi"},
                    {"Tesla", "AI Engineer", "Remote"}
            };
            for(String[] c : companies) {
                Job j = new Job();
                j.setCompanyName(c[0]);
                j.setRole(c[1]);
                j.setLocation(c[2]);
                jobRepository.save(j);
            }
            return "6 Companies Added!";
        }
        return "Companies already exist.";
    }
}