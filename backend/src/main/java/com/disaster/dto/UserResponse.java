package com.disaster.dto;

import com.disaster.model.AccountStatus;
import com.disaster.model.Role;
import com.disaster.model.User;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String location;
    private String phone;
    private Role role;
    private AccountStatus accountStatus;
    private LocalDateTime createdAt;
    private Long alertsAcknowledgedCount;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String location, String phone,
                        Role role, AccountStatus accountStatus, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.location = location;
        this.phone = phone;
        this.role = role;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getLocation(),
                user.getPhone(),
                user.getRole(),
                user.getAccountStatus(),
                user.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getAlertsAcknowledgedCount() {
        return alertsAcknowledgedCount;
    }

    public void setAlertsAcknowledgedCount(Long alertsAcknowledgedCount) {
        this.alertsAcknowledgedCount = alertsAcknowledgedCount;
    }
}
