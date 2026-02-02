package com.adithya.loginregister.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Value("${app.security.disable-auth:false}")
    private boolean disableAuth;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable());

        if (disableAuth) {
            // Dev mode: allow all requests without authentication
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            http
            .authorizeHttpRequests(auth -> auth
                // Always allow CORS preflight requests
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // Explicitly allow POST to registration endpoint
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/auth/register").permitAll()
                // Allow other auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new JsonAuthEntryPoint())
                .accessDeniedHandler(new JsonAccessDeniedHandler())
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        }

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
        // dev: allow any localhost port patterns to avoid origin mismatch issues in local testing
        config.setAllowedOriginPatterns(java.util.List.of("http://localhost:*","http://127.0.0.1:*"));
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
