package com.example.eventmanagement.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventmanagement.service.EmailService;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-ticket")
    public ResponseEntity<String> sendTicket(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String eventTitle = request.get("eventTitle");

        byte[] dummyPdf = ("Your ticket for event: " + eventTitle).getBytes();

        emailService.sendTicketWithAttachment(
            email,
            "Your Ticket for " + eventTitle,
            "Thanks for booking. Your ticket is attached.",
            dummyPdf
        );

        return ResponseEntity.ok("Email sent");
    }
}