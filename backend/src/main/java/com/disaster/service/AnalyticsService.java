package com.disaster.service;

import com.disaster.dto.AlertResponse;
import com.disaster.dto.DashboardStatsResponse;
import com.disaster.dto.UserDashboardStatsResponse;
import com.disaster.model.*;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.DisasterAlertRepository;
import com.disaster.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final DisasterAlertRepository alertRepository;
    private final AlertReadStatusRepository alertReadStatusRepository;
    private final DisasterAlertService alertService;

    public AnalyticsService(UserRepository userRepository, DisasterAlertRepository alertRepository,
                            AlertReadStatusRepository alertReadStatusRepository,
                            DisasterAlertService alertService) {
        this.userRepository = userRepository;
        this.alertRepository = alertRepository;
        this.alertReadStatusRepository = alertReadStatusRepository;
        this.alertService = alertService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalUsers(userRepository.countByRole(Role.ROLE_COMMUNITY_USER));
        stats.setActiveUsers(userRepository.countByAccountStatus(AccountStatus.ACTIVE));

        stats.setTotalAlerts(alertRepository.count());
        stats.setActiveAlerts(alertRepository.countByStatus(AlertStatus.ACTIVE));
        stats.setResolvedAlerts(alertRepository.countByStatus(AlertStatus.RESOLVED));
        stats.setExpiredAlerts(alertRepository.countByStatus(AlertStatus.EXPIRED));

        stats.setCriticalAlerts(alertRepository.countBySeverity(SeverityLevel.CRITICAL));
        stats.setHighAlerts(alertRepository.countBySeverity(SeverityLevel.HIGH));
        stats.setMediumAlerts(alertRepository.countBySeverity(SeverityLevel.MEDIUM));
        stats.setLowAlerts(alertRepository.countBySeverity(SeverityLevel.LOW));

        stats.setTotalAcknowledgedReads(alertReadStatusRepository.count());

        // Alerts by Disaster Type
        Map<String, Long> typeMap = new HashMap<>();
        for (DisasterType type : DisasterType.values()) {
            typeMap.put(type.name(), alertRepository.countByDisasterType(type));
        }
        stats.setAlertsByDisasterType(typeMap);

        // Alerts by Severity
        Map<String, Long> severityMap = new HashMap<>();
        for (SeverityLevel sev : SeverityLevel.values()) {
            severityMap.put(sev.name(), alertRepository.countBySeverity(sev));
        }
        stats.setAlertsBySeverity(severityMap);

        // Alerts by Status
        Map<String, Long> statusMap = new HashMap<>();
        for (AlertStatus st : AlertStatus.values()) {
            statusMap.put(st.name(), alertRepository.countByStatus(st));
        }
        stats.setAlertsByStatus(statusMap);

        // Recent 5 alerts
        List<DisasterAlert> recent = alertRepository.findTop5ByOrderByAlertDateTimeDesc();
        List<AlertResponse> recentResponses = recent.stream()
                .map(a -> {
                    AlertResponse r = AlertResponse.fromEntity(a);
                    r.setReadCount(alertReadStatusRepository.countByAlertId(a.getId()));
                    return r;
                })
                .collect(Collectors.toList());
        stats.setRecentAlerts(recentResponses);

        return stats;
    }

    @Transactional(readOnly = true)
    public UserDashboardStatsResponse getUserDashboardStats(Long userId, String userLocation) {
        List<DisasterAlert> activeAlerts = alertRepository.findByStatusOrderByAlertDateTimeDesc(AlertStatus.ACTIVE);
        List<Long> readAlertIds = alertReadStatusRepository.findAlertIdsReadByUserId(userId);

        long totalActive = activeAlerts.size();
        long inLocation = 0;
        long unreadCritical = 0;

        for (DisasterAlert alert : activeAlerts) {
            boolean isSameLocation = userLocation != null && !userLocation.isBlank() &&
                    (alert.getLocation().toLowerCase().contains(userLocation.toLowerCase()) ||
                     userLocation.toLowerCase().contains(alert.getLocation().toLowerCase()));
            if (isSameLocation) {
                inLocation++;
            }

            boolean isRead = readAlertIds.contains(alert.getId());
            if (alert.getSeverity() == SeverityLevel.CRITICAL && !isRead) {
                unreadCritical++;
            }
        }

        long acknowledged = readAlertIds.size();

        return new UserDashboardStatsResponse(totalActive, inLocation, unreadCritical, acknowledged, userLocation);
    }
}
