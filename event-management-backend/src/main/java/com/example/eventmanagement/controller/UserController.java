package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.User;
import com.example.eventmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login logic would normally involve JWT, but for now we return the user
    @PostMapping("/login")
    public User loginUser(@RequestBody User loginData) {
        return userService.findByEmail(loginData.getEmail())
                .filter(user -> user.getPassword().equals(loginData.getPassword()))
                .orElse(null);  // Return null if not found or password mismatch
    }
}
