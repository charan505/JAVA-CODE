package com.disaster.dto;

public class UserDashboardStatsResponse {

    private long totalActiveAlerts;
    private long activeAlertsInLocation;
    private long unreadCriticalAlerts;
    private long acknowledgedAlerts;
    private String userLocation;

    public UserDashboardStatsResponse() {
    }

    public UserDashboardStatsResponse(long totalActiveAlerts, long activeAlertsInLocation, long unreadCriticalAlerts, long acknowledgedAlerts, String userLocation) {
        this.totalActiveAlerts = totalActiveAlerts;
        this.activeAlertsInLocation = activeAlertsInLocation;
        this.unreadCriticalAlerts = unreadCriticalAlerts;
        this.acknowledgedAlerts = acknowledgedAlerts;
        this.userLocation = userLocation;
    }

    public long getTotalActiveAlerts() {
        return totalActiveAlerts;
    }

    public void setTotalActiveAlerts(long totalActiveAlerts) {
        this.totalActiveAlerts = totalActiveAlerts;
    }

    public long getActiveAlertsInLocation() {
        return activeAlertsInLocation;
    }

    public void setActiveAlertsInLocation(long activeAlertsInLocation) {
        this.activeAlertsInLocation = activeAlertsInLocation;
    }

    public long getUnreadCriticalAlerts() {
        return unreadCriticalAlerts;
    }

    public void setUnreadCriticalAlerts(long unreadCriticalAlerts) {
        this.unreadCriticalAlerts = unreadCriticalAlerts;
    }

    public long getAcknowledgedAlerts() {
        return acknowledgedAlerts;
    }

    public void setAcknowledgedAlerts(long acknowledgedAlerts) {
        this.acknowledgedAlerts = acknowledgedAlerts;
    }

    public String getUserLocation() {
        return userLocation;
    }

    public void setUserLocation(String userLocation) {
        this.userLocation = userLocation;
    }
}
