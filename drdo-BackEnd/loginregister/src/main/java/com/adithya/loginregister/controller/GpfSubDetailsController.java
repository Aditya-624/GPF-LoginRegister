package com.adithya.loginregister.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GpfSubDetails;
import com.adithya.loginregister.repository.GpfSubDetailsRepository;

@RestController
@RequestMapping("/api/gpf-sub-details")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class GpfSubDetailsController {

    private final GpfSubDetailsRepository repo;

    public GpfSubDetailsController(GpfSubDetailsRepository repo) {
        this.repo = repo;
    }

    // GET all records for a pers number
    @GetMapping("/by-pers/{persNumber}")
    public ResponseEntity<?> getByPersNumber(@PathVariable String persNumber) {
        try {
            List<GpfSubDetails> list = repo.findByPersNumber(persNumber);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(java.util.Map.of("error", e.getMessage(), "cause", e.getCause() != null ? e.getCause().getMessage() : "none"));
        }
    }

    // POST save new record
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody GpfSubDetails record) {
        try {
            GpfSubDetails saved = repo.save(record);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(java.util.Map.of("error", e.getMessage(), "cause", e.getCause() != null ? e.getCause().getMessage() : "none"));
        }
    }

    // DELETE by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
