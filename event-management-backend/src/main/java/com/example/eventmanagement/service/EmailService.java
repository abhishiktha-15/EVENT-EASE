package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ Send plain confirmation email
    public void sendRegistrationEmail(String toEmail, String eventTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Event Registration Confirmation");
            message.setText("Thank you for registering for the event: " + eventTitle);
            mailSender.send(message);

            System.out.println("✅ Confirmation email sent to: " + toEmail + " for event: " + eventTitle);
        } catch (Exception e) {
            System.err.println("❌ Failed to send registration email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ✅ Send email with PDF ticket attachment
  public void sendTicketWithAttachment(String to, String subject, String body, byte[] pdfBytes) {
    try {
        // 📌 Log recipient
        System.out.println("📧 Sending ticket to: " + to);

        // ✅ Null check
        if (pdfBytes == null || pdfBytes.length == 0) {
            System.err.println("❌ PDF ticket is empty or null. Email not sent.");
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment("ticket.pdf", new ByteArrayResource(pdfBytes));

        mailSender.send(message);
        System.out.println("✅ Ticket email sent successfully to: " + to);
    } catch (Exception e) {
        System.err.println("❌ Failed to send ticket email to " + to + ": " + e.getMessage());
        e.printStackTrace(); // 🔍 Helps trace SSL/TLS or SMTP issues
    }
}
  
}
