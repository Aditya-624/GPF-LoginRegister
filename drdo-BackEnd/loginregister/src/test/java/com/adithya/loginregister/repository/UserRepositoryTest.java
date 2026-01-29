package com.adithya.loginregister.repository;

import com.adithya.loginregister.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByUsername() {
        User u = new User();
        u.setUsername("alice");
        u.setEmail("alice@example.com");
        u.setPassword("password123");
        userRepository.saveAndFlush(u);

        assertTrue(userRepository.findByUsername("alice").isPresent());
    }

    @Test
    void duplicateUsernameThrows() {
        User u1 = new User();
        u1.setUsername("bob");
        u1.setEmail("bob1@example.com");
        u1.setPassword("password123");
        userRepository.saveAndFlush(u1);

        User u2 = new User();
        u2.setUsername("bob");
        u2.setEmail("bob2@example.com");
        u2.setPassword("password123");

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(u2);
        });
    }
}