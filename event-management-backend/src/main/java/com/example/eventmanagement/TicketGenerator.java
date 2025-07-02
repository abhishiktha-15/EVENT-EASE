package com.example.eventmanagement;

import java.io.ByteArrayOutputStream;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.User;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;

public class TicketGenerator {

    public static byte[] generateTicket(User user, Event event) {
        try {
            Document document = new Document();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.DARK_GRAY);

            // Title
            Paragraph title = new Paragraph("🎫 EVENT TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // User Details
            document.add(new Paragraph("👤 Name: " + user.getName(), normalFont));
            document.add(new Paragraph("📧 Email: " + user.getEmail(), normalFont));
            document.add(Chunk.NEWLINE);

            // Event Details
            document.add(new Paragraph("📅 Event: " + event.getTitle(), normalFont));
            document.add(new Paragraph("📍 Venue: " + event.getVenue(), normalFont));
            document.add(new Paragraph("🕒 Date: " + event.getDate().toString(), normalFont));
            document.add(new Paragraph("💳 Status: PAID", normalFont));
            document.add(Chunk.NEWLINE);

            // Notes
            document.add(new Paragraph("✔ Please bring this ticket to the event.", normalFont));
            document.add(new Paragraph("✔ Show this at the entry gate to access the venue.", normalFont));
            document.add(Chunk.NEWLINE);

            // Footer
            LineSeparator ls = new LineSeparator();
            document.add(new Chunk(ls));
            Paragraph footer = new Paragraph("Thank you for booking with us! - Event Team", 
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}