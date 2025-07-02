package com.example.eventmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Registration;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.RegistrationRepository;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    public Registration registerUserForEvent(User user, Event event) {
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus("UNPAID"); // Default status at registration
        return registrationRepository.save(registration);
    }

    public List<Registration> getUserRegistrations(User user) {
        return registrationRepository.findByUser(user);
    }

    public List<Registration> getEventRegistrations(Event event) {
        return registrationRepository.findByEvent(event);
    }

    public boolean isAlreadyRegistered(User user, Event event) {
        return registrationRepository.findByUserAndEvent(user, event).isPresent();
    }

    public Registration findById(Long id) {
        return registrationRepository.findById(id).orElse(null);
    }

    public void deleteRegistration(Long id) {
        registrationRepository.deleteById(id);
    }

    public Registration save(Registration registration) {
        return registrationRepository.save(registration);
    }

    // ✅ Newly added to support /user/{userId} fetch
    public List<Registration> getRegistrationsByUserId(Long userId) {
        return registrationRepository.findByUserId(userId);
    }
    public List<Registration> getRegistrationsByEventId(Long eventId) {
    return registrationRepository.findByEventId(eventId);
    }

}
