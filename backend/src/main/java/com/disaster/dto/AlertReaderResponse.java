package com.disaster.dto;

import java.time.LocalDateTime;

public class AlertReaderResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String location;
    private LocalDateTime readAt;

    public AlertReaderResponse() {
    }

    public AlertReaderResponse(Long userId, String fullName, String email, String location, LocalDateTime readAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.location = location;
        this.readAt = readAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}
