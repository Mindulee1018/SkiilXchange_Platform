package com.example.skillxchange.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.skillxchange.backend.util.JwtUtil;
import com.example.skillxchange.backend.repository.UserRepository;
import com.example.skillxchange.backend.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        var user = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");
        String username = user.getAttribute("name"); // Get the Google user's username (if available)

        // Check if user exists in the database, else create a new user without a password
        User existingUser = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(username, email, ""); // No password for Google users
            return userRepository.save(newUser);
        });

        // Generate the JWT token using the username or email
        String token = jwtUtil.generateToken(existingUser.getUsername());

        System.out.println("Generated JWT Token: " + token);  // Log the token to check
        response.sendRedirect("http://localhost:3000/oauth2-success?token=" + token); // Your frontend URL
    }
}
