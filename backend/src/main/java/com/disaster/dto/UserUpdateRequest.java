package com.disaster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserUpdateRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Location is required")
    private String location;

    private String phone;

    @Size(min = 6, message = "Password must be at least 6 characters if changed")
    private String newPassword;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String fullName, String location, String phone, String newPassword) {
        this.fullName = fullName;
        this.location = location;
        this.phone = phone;
        this.newPassword = newPassword;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
