package com.adithya.loginregister.repository;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import com.adithya.loginregister.entity.User;

@SpringBootTest
@Transactional
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByUsername() {
        User u = new User();
        u.setUsername("alice");
        u.setWorkStatus("OFFICER");
        u.setPassword("password123");
        userRepository.saveAndFlush(u);

        assertTrue(userRepository.findByUsername("alice").isPresent());
    }

    @Test
    void duplicateUsernameThrows() {
        User u1 = new User();
        u1.setUsername("bob");
        u1.setWorkStatus("INDUSTRIAL");
        u1.setPassword("password123");
        userRepository.saveAndFlush(u1);

        User u2 = new User();
        u2.setUsername("bob");
        u2.setWorkStatus("NON_INDUSTRIAL");
        u2.setPassword("password123");

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(u2);
        });
    }
}