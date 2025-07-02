package com.example.eventmanagement.dto;

public class RegistrationResponseDTO {
    private String userEmail;
    private String userName;
    private String status;

    public RegistrationResponseDTO(String userEmail, String userName, String status) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.status = status;
    }

    public String getUserEmail() { return userEmail; }
    public String getUserName() { return userName; }
    public String getStatus() { return status; }
}
