package com.disaster.dto;

import com.disaster.model.AlertStatus;
import com.disaster.model.DisasterType;
import com.disaster.model.SeverityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AlertRequest {

    @NotNull(message = "Disaster type is required")
    private DisasterType disasterType;

    @NotBlank(message = "Alert title is required")
    private String title;

    @NotBlank(message = "Alert description is required")
    private String description;

    @NotBlank(message = "Affected location is required")
    private String location;

    @NotNull(message = "Severity level is required")
    private SeverityLevel severity = SeverityLevel.MEDIUM;

    private LocalDateTime alertDateTime;

    private String safetyInstructions;

    private AlertStatus status = AlertStatus.ACTIVE;

    public AlertRequest() {
    }

    public AlertRequest(DisasterType disasterType, String title, String description, String location,
                        SeverityLevel severity, LocalDateTime alertDateTime, String safetyInstructions, AlertStatus status) {
        this.disasterType = disasterType;
        this.title = title;
        this.description = description;
        this.location = location;
        this.severity = severity;
        this.alertDateTime = alertDateTime;
        this.safetyInstructions = safetyInstructions;
        this.status = status;
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
}
