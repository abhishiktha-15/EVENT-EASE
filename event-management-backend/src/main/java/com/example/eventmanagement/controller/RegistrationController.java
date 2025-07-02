package com.example.eventmanagement.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventmanagement.TicketGenerator;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Registration;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.service.EmailService;
import com.example.eventmanagement.service.EventService;
import com.example.eventmanagement.service.RegistrationService;
import com.example.eventmanagement.service.UserService;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @Autowired
    private EmailService emailService;

    // ✅ BOOK EVENT
    @PostMapping("/{userId}/{eventId}")
    public ResponseEntity<?> registerUserForEvent(@PathVariable Long userId, @PathVariable Long eventId) {
        System.out.println("📩 Booking request: userId=" + userId + ", eventId=" + eventId);

        User user = userService.findById(userId).orElse(null);
        Event event = eventService.getEventById(eventId).orElse(null);

        if (user == null || event == null) {
            return ResponseEntity.notFound().build();
        }

        if (registrationService.isAlreadyRegistered(user, event)) {
            return ResponseEntity.status(409).body("User already booked this event");
        }

        try {
            Registration registration = new Registration();
            registration.setUser(user);
            registration.setEvent(event);
            registration.setStatus("REGISTERED");
            registrationService.save(registration);

            System.out.println("✅ Registration saved successfully.");
            return ResponseEntity.ok(registration);

        } catch (Exception e) {
            System.err.println("❌ Error during registration: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Booking failed");
        }
    }

    // ✅ PAY & SEND TICKET
    @PostMapping("/pay/{registrationId}")
    public ResponseEntity<?> markAsPaid(@PathVariable Long registrationId) {
        Registration registration = registrationService.findById(registrationId);
        if (registration == null || "PAID".equals(registration.getStatus())) {
            return ResponseEntity.badRequest().body("Invalid registration or already paid");
        }

        try {
            registration.setStatus("PAID");
            registrationService.save(registration);

            // ✅ Generate Ticket
            byte[] pdf = TicketGenerator.generateTicket(registration.getUser(), registration.getEvent());

            // ✅ Send Email
            emailService.sendTicketWithAttachment(
                registration.getUser().getEmail(),
                "🎫 Your Event Ticket - " + registration.getEvent().getTitle(),
                "Hi " + registration.getUser().getName() + ",\n\nThank you for your payment for the event '" +
                        registration.getEvent().getTitle() +
                        "'.\n\nPlease find your ticket attached.\n\nBest regards,\nEvent Team",
                pdf
            );

            System.out.println("✅ Payment processed and email sent to user.");
            return ResponseEntity.ok(registration);

        } catch (Exception e) {
            // Rollback payment status
            registration.setStatus("REGISTERED");
            registrationService.save(registration);
            System.err.println("❌ Payment failed or email not sent: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Payment failed. Could not send ticket.");
        }
    }

    // ✅ CANCEL REGISTRATION
    @DeleteMapping("/{registrationId}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long registrationId) {
        Registration registration = registrationService.findById(registrationId);
        if (registration == null) {
            return ResponseEntity.notFound().build();
        }

        if ("PAID".equals(registration.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot cancel a paid registration");
        }

        registrationService.deleteRegistration(registrationId);
        return ResponseEntity.ok("Registration cancelled successfully");
    }

    // ✅ GET ALL USER BOOKINGS
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRegistrationsByUser(@PathVariable Long userId) {
        try {
            List<Registration> registrations = registrationService.getRegistrationsByUserId(userId);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Registration reg : registrations) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", reg.getId());
                map.put("status", reg.getStatus());
                map.put("event", reg.getEvent());
                result.add(map);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch registrations: " + e.getMessage());
        }
    }
    @GetMapping("/test-mail")
    public ResponseEntity<String> testMail() {
        try {
            emailService.sendRegistrationEmail("your_email@gmail.com", "Test Event");
            return ResponseEntity.ok("✅ Test mail sent successfully. Check your inbox.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to send test mail: " + e.getMessage());
        }
    }
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getRegistrationsByEvent(@PathVariable Long eventId) {
        try {
            List<Registration> registrations = registrationService.getRegistrationsByEventId(eventId);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Registration reg : registrations) {
                Map<String, Object> map = new HashMap<>();
                map.put("userName", reg.getUser().getName());
                map.put("userEmail", reg.getUser().getEmail());
                map.put("status", reg.getStatus());
                map.put("eventTitle", reg.getEvent().getTitle());
                result.add(map);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Failed to fetch registrants: " + e.getMessage());
        }
    }
    
}


