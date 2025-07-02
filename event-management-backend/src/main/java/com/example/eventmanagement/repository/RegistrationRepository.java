package com.example.eventmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Registration;
import com.example.eventmanagement.model.User;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUser(User user);
    Optional<Registration> findByUserAndEvent(User user, Event event);
    List<Registration> findByEvent(Event event);

    // ✅ Added to support userId-based fetch in controller
    List<Registration> findByUserId(Long userId);
    List<Registration> findByEventId(Long eventId);
   
}
