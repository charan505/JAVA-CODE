package com.disaster.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disaster_alerts")
public class DisasterAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "disaster_type", nullable = false, length = 40)
    private DisasterType disasterType;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SeverityLevel severity = SeverityLevel.MEDIUM;

    @Column(name = "alert_date_time", nullable = false)
    private LocalDateTime alertDateTime;

    @Column(name = "safety_instructions", columnDefinition = "TEXT")
    private String safetyInstructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertStatus status = AlertStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "alert", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AlertReadStatus> readStatuses = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public DisasterAlert() {
    }

    public DisasterAlert(DisasterType disasterType, String title, String description, String location,
                         SeverityLevel severity, LocalDateTime alertDateTime, String safetyInstructions,
                         AlertStatus status, User createdBy) {
        this.disasterType = disasterType;
        this.title = title;
        this.description = description;
        this.location = location;
        this.severity = severity;
        this.alertDateTime = alertDateTime;
        this.safetyInstructions = safetyInstructions;
        this.status = status;
        this.createdBy = createdBy;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.alertDateTime == null) {
            this.alertDateTime = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = AlertStatus.ACTIVE;
        }
        if (this.severity == null) {
            this.severity = SeverityLevel.MEDIUM;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<AlertReadStatus> getReadStatuses() {
        return readStatuses;
    }

    public void setReadStatuses(List<AlertReadStatus> readStatuses) {
        this.readStatuses = readStatuses;
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
}
