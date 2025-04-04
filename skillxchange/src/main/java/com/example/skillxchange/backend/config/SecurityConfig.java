package com.example.skillxchange.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for testing
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Allow access to auth endpoints
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())  // Disable default login form
            .httpBasic(basic -> basic.disable());  // Disable basic authentication

        return http.build();
    }
}
