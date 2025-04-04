package com.example.skillxchange.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.skillxchange.backend.dto.UserDTO;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.UserRepository;;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String signUp(UserDTO userDTO) {
        Optional<User> existingUserByEmail = userRepository.findByEmail(userDTO.getEmail());
        Optional<User> existingUserByUsername = userRepository.findByUsername(userDTO.getUsername());

        if (existingUserByEmail.isPresent()) {
            return "Email already taken";
        }

        if (existingUserByUsername.isPresent()) {
            return "Username already taken";
        }

        // Encrypt password before saving
        String encryptedPassword = passwordEncoder.encode(userDTO.getPassword());

        User user = new User(userDTO.getUsername(), userDTO.getEmail(), encryptedPassword);
        userRepository.save(user);

        return "User registered successfully";
    }
    
}