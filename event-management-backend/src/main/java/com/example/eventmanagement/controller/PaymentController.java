package com.example.eventmanagement.controller;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventmanagement.TicketGenerator;
import com.example.eventmanagement.model.Registration;
import com.example.eventmanagement.service.EmailService;
import com.example.eventmanagement.service.RegistrationService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private EmailService emailService;

    // ✅ Create Razorpay Order with event-specific price
    @PostMapping("/create-order/{registrationId}")
    public ResponseEntity<?> createOrder(@PathVariable Long registrationId) {
        try {
            Registration reg = registrationService.findById(registrationId);
            if (reg == null) return ResponseEntity.badRequest().body("❌ Invalid registration ID");

            int amount = (int) (reg.getEvent().getPrice() * 100); // ₹ to paise

            RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "reg_" + registrationId);

            Order order = client.orders.create(orderRequest);

            // ✅ FIX: Explicit cast to (Object) to avoid ambiguity
            JSONObject response = new JSONObject();
            response.put("orderId", (Object) order.get("id"));
            response.put("amount", (Object) order.get("amount"));
            response.put("currency", (Object) order.get("currency"));
            response.put("key", razorpayKey); // razorpayKey is already String

            return ResponseEntity.ok(response.toString());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Razorpay order error: " + e.getMessage());
        }
    }

    // ✅ Verify Payment & Send Ticket
    @PostMapping("/verify/{registrationId}")
    public ResponseEntity<?> verifyPayment(@PathVariable Long registrationId, @RequestBody Map<String, String> payload) {
        try {
            Registration reg = registrationService.findById(registrationId);
            if (reg == null) return ResponseEntity.badRequest().body("❌ Invalid registration");

            reg.setStatus("PAID");
            registrationService.save(reg);

            // 🎟️ Generate ticket
            byte[] pdf = TicketGenerator.generateTicket(reg.getUser(), reg.getEvent());

            // 📧 Send email
            String subject = "🎫 Your Ticket for " + reg.getEvent().getTitle();
            String body = "Hi " + reg.getUser().getName() + ",\n\nThank you for your payment.\nPlease find your ticket attached.\n\nRegards,\nEvent Team";

            emailService.sendTicketWithAttachment(reg.getUser().getEmail(), subject, body, pdf);

            return ResponseEntity.ok("✅ Payment successful. Ticket sent to email.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Payment processing error: " + e.getMessage());
        }
    }
}
