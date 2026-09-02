package com.disaster.dto;

import com.disaster.model.AlertStatus;
import com.disaster.model.DisasterAlert;
import com.disaster.model.DisasterType;
import com.disaster.model.SeverityLevel;

import java.time.LocalDateTime;

public class AlertResponse {

    private Long id;
    private DisasterType disasterType;
    private String title;
    private String description;
    private String location;
    private SeverityLevel severity;
    private LocalDateTime alertDateTime;
    private String safetyInstructions;
    private AlertStatus status;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long readCount = 0L;
    private Boolean isReadByCurrentUser = false;
    private LocalDateTime currentUserReadAt;

    public AlertResponse() {
    }

    public static AlertResponse fromEntity(DisasterAlert alert) {
        if (alert == null) return null;
        AlertResponse response = new AlertResponse();
        response.setId(alert.getId());
        response.setDisasterType(alert.getDisasterType());
        response.setTitle(alert.getTitle());
        response.setDescription(alert.getDescription());
        response.setLocation(alert.getLocation());
        response.setSeverity(alert.getSeverity());
        response.setAlertDateTime(alert.getAlertDateTime());
        response.setSafetyInstructions(alert.getSafetyInstructions());
        response.setStatus(alert.getStatus());
        if (alert.getCreatedBy() != null) {
            response.setCreatedById(alert.getCreatedBy().getId());
            response.setCreatedByName(alert.getCreatedBy().getFullName());
        }
        response.setCreatedAt(alert.getCreatedAt());
        response.setUpdatedAt(alert.getUpdatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DisasterType getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(DisasterType disasterType) {
        this.disasterType = disasterType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public SeverityLevel getSeverity() {
        return severity;
    }

    public void setSeverity(SeverityLevel severity) {
        this.severity = severity;
    }

    public LocalDateTime getAlertDateTime() {
        return alertDateTime;
    }

    public void setAlertDateTime(LocalDateTime alertDateTime) {
        this.alertDateTime = alertDateTime;
    }

    public String getSafetyInstructions() {
        return safetyInstructions;
    }

    public void setSafetyInstructions(String safetyInstructions) {
        this.safetyInstructions = safetyInstructions;
    }

    public AlertStatus getStatus() {
        return status;
    }

    public void setStatus(AlertStatus status) {
        this.status = status;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getReadCount() {
        return readCount;
    }

    public void setReadCount(Long readCount) {
        this.readCount = readCount;
    }

    public Boolean getIsReadByCurrentUser() {
        return isReadByCurrentUser;
    }

    public void setIsReadByCurrentUser(Boolean isReadByCurrentUser) {
        this.isReadByCurrentUser = isReadByCurrentUser;
    }

    public LocalDateTime getCurrentUserReadAt() {
        return currentUserReadAt;
    }

    public void setCurrentUserReadAt(LocalDateTime currentUserReadAt) {
        this.currentUserReadAt = currentUserReadAt;
    }
}
