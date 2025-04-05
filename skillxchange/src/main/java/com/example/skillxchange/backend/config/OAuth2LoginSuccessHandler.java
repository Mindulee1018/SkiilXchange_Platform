package com.example.skillxchange.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.skillxchange.backend.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        var user = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");
        String token = jwtUtil.generateToken(email);

        response.sendRedirect("http://localhost:3000/oauth2-success?token=" + token); // Your frontend URL
    }
}
