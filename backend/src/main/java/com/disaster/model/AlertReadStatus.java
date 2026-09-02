package com.disaster.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert_read_status", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_alert", columnNames = {"user_id", "alert_id"})
})
public class AlertReadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "alert_id", nullable = false)
    private DisasterAlert alert;

    @Column(name = "read_at", nullable = false)
    private LocalDateTime readAt;

    public AlertReadStatus() {
    }

    public AlertReadStatus(User user, DisasterAlert alert) {
        this.user = user;
        this.alert = alert;
        this.readAt = LocalDateTime.now();
    }

    public AlertReadStatus(User user, DisasterAlert alert, LocalDateTime readAt) {
        this.user = user;
        this.alert = alert;
        this.readAt = readAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DisasterAlert getAlert() {
        return alert;
    }

    public void setAlert(DisasterAlert alert) {
        this.alert = alert;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}
