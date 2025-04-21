package com.example.skillxchange.backend.config;

import com.example.skillxchange.backend.util.JwtUtil;
import com.example.skillxchange.backend.model.User;
import com.example.skillxchange.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Remove "Bearer "
        String username = jwtUtil.getUsernameFromToken(token);
        System.out.println("Extracted username/email from token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent() && jwtUtil.validateToken(token)) {
                User user = userOpt.get();

                System.out.println("User present: " + userOpt.isPresent());
                System.out.println("JWT valid: " + jwtUtil.validateToken(token));

                UserDetails userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword()) // optional, not used here
                        .authorities(Collections.emptyList()) // no roles for now
                        .build();

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);


            }
        }
        //System.out.println("JWT filter triggered for request: " + request.getRequestURI());

        filterChain.doFilter(request, response);
    }
}