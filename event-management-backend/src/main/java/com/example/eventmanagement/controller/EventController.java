package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    @Autowired
    private EventService eventService;

    // ✅ GET: Fetch all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // ✅ POST: Create new event (including price)
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event saved = eventService.saveEvent(event);
        return ResponseEntity.ok(saved);
    }

    // ✅ GET: Get single event by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
            .map(event -> ResponseEntity.ok(event))
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE: Delete event by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ PUT: Update event (including price)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventService.getEventById(id)
            .map(existing -> {
                existing.setTitle(updatedEvent.getTitle());
                existing.setDescription(updatedEvent.getDescription());
                existing.setVenue(updatedEvent.getVenue());
                existing.setDate(updatedEvent.getDate());
                existing.setPrice(updatedEvent.getPrice()); // ✅ update price too
                eventService.saveEvent(existing);
                return ResponseEntity.ok(existing);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
