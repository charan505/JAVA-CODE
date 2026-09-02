package com.disaster.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalUsers;
    private long activeUsers;
    private long totalAlerts;
    private long activeAlerts;
    private long resolvedAlerts;
    private long expiredAlerts;
    private long criticalAlerts;
    private long highAlerts;
    private long mediumAlerts;
    private long lowAlerts;
    private long totalAcknowledgedReads;
    private Map<String, Long> alertsByDisasterType = new HashMap<>();
    private Map<String, Long> alertsBySeverity = new HashMap<>();
    private Map<String, Long> alertsByStatus = new HashMap<>();
    private List<AlertResponse> recentAlerts;

    public DashboardStatsResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getTotalAlerts() {
        return totalAlerts;
    }

    public void setTotalAlerts(long totalAlerts) {
        this.totalAlerts = totalAlerts;
    }

    public long getActiveAlerts() {
        return activeAlerts;
    }

    public void setActiveAlerts(long activeAlerts) {
        this.activeAlerts = activeAlerts;
    }

    public long getResolvedAlerts() {
        return resolvedAlerts;
    }

    public void setResolvedAlerts(long resolvedAlerts) {
        this.resolvedAlerts = resolvedAlerts;
    }

    public long getExpiredAlerts() {
        return expiredAlerts;
    }

    public void setExpiredAlerts(long expiredAlerts) {
        this.expiredAlerts = expiredAlerts;
    }

    public long getCriticalAlerts() {
        return criticalAlerts;
    }

    public void setCriticalAlerts(long criticalAlerts) {
        this.criticalAlerts = criticalAlerts;
    }

    public long getHighAlerts() {
        return highAlerts;
    }

    public void setHighAlerts(long highAlerts) {
        this.highAlerts = highAlerts;
    }

    public long getMediumAlerts() {
        return mediumAlerts;
    }

    public void setMediumAlerts(long mediumAlerts) {
        this.mediumAlerts = mediumAlerts;
    }

    public long getLowAlerts() {
        return lowAlerts;
    }

    public void setLowAlerts(long lowAlerts) {
        this.lowAlerts = lowAlerts;
    }

    public long getTotalAcknowledgedReads() {
        return totalAcknowledgedReads;
    }

    public void setTotalAcknowledgedReads(long totalAcknowledgedReads) {
        this.totalAcknowledgedReads = totalAcknowledgedReads;
    }

    public Map<String, Long> getAlertsByDisasterType() {
        return alertsByDisasterType;
    }

    public void setAlertsByDisasterType(Map<String, Long> alertsByDisasterType) {
        this.alertsByDisasterType = alertsByDisasterType;
    }

    public Map<String, Long> getAlertsBySeverity() {
        return alertsBySeverity;
    }

    public void setAlertsBySeverity(Map<String, Long> alertsBySeverity) {
        this.alertsBySeverity = alertsBySeverity;
    }

    public Map<String, Long> getAlertsByStatus() {
        return alertsByStatus;
    }

    public void setAlertsByStatus(Map<String, Long> alertsByStatus) {
        this.alertsByStatus = alertsByStatus;
    }

    public List<AlertResponse> getRecentAlerts() {
        return recentAlerts;
    }

    public void setRecentAlerts(List<AlertResponse> recentAlerts) {
        this.recentAlerts = recentAlerts;
    }
}
