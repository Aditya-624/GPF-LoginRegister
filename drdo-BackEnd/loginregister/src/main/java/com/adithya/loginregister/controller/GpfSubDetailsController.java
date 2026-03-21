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
@CrossOrigin(origins = "*")
public class GpfSubDetailsController {

    private final GpfSubDetailsRepository repo;

    public GpfSubDetailsController(GpfSubDetailsRepository repo) {
        this.repo = repo;
    }

    // GET all records for a pers number
    @GetMapping("/by-pers/{persNumber}")
    public ResponseEntity<List<GpfSubDetails>> getByPersNumber(@PathVariable String persNumber) {
        List<GpfSubDetails> list = repo.findByPersNumber(persNumber);
        return ResponseEntity.ok(list);
    }

    // POST save new record
    @PostMapping("/save")
    public ResponseEntity<GpfSubDetails> save(@RequestBody GpfSubDetails record) {
        GpfSubDetails saved = repo.save(record);
        return ResponseEntity.ok(saved);
    }

    // DELETE by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
