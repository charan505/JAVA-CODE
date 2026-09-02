package com.disaster.service;

import com.disaster.dto.AlertRequest;
import com.disaster.dto.AlertResponse;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.model.*;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.DisasterAlertRepository;
import com.disaster.repository.UserRepository;
import com.disaster.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DisasterAlertService {

    private final DisasterAlertRepository alertRepository;
    private final UserRepository userRepository;
    private final AlertReadStatusRepository alertReadStatusRepository;

    public DisasterAlertService(DisasterAlertRepository alertRepository, UserRepository userRepository,
                                AlertReadStatusRepository alertReadStatusRepository) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.alertReadStatusRepository = alertReadStatusRepository;
    }

    @Transactional
    public AlertResponse createAlert(AlertRequest request, UserPrincipal currentUser) {
        User creator = null;
        if (currentUser != null) {
            creator = userRepository.findById(currentUser.getId()).orElse(null);
        }

        DisasterAlert alert = new DisasterAlert();
        alert.setDisasterType(request.getDisasterType());
        alert.setTitle(request.getTitle().trim());
        alert.setDescription(request.getDescription().trim());
        alert.setLocation(request.getLocation().trim());
        alert.setSeverity(request.getSeverity() != null ? request.getSeverity() : SeverityLevel.MEDIUM);
        alert.setAlertDateTime(request.getAlertDateTime() != null ? request.getAlertDateTime() : LocalDateTime.now());
        alert.setSafetyInstructions(request.getSafetyInstructions());
        alert.setStatus(request.getStatus() != null ? request.getStatus() : AlertStatus.ACTIVE);
        alert.setCreatedBy(creator);

        DisasterAlert saved = alertRepository.save(alert);
        return mapToResponse(saved, currentUser != null ? currentUser.getId() : null);
    }

    @Transactional
    public AlertResponse updateAlert(Long id, AlertRequest request, UserPrincipal currentUser) {
        DisasterAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterAlert", "id", id));

        alert.setDisasterType(request.getDisasterType());
        alert.setTitle(request.getTitle().trim());
        alert.setDescription(request.getDescription().trim());
        alert.setLocation(request.getLocation().trim());
        alert.setSeverity(request.getSeverity());
        if (request.getAlertDateTime() != null) {
            alert.setAlertDateTime(request.getAlertDateTime());
        }
        alert.setSafetyInstructions(request.getSafetyInstructions());
        if (request.getStatus() != null) {
            alert.setStatus(request.getStatus());
        }

        DisasterAlert updated = alertRepository.save(alert);
        return mapToResponse(updated, currentUser != null ? currentUser.getId() : null);
    }

    @Transactional
    public AlertResponse updateAlertStatus(Long id, AlertStatus status, UserPrincipal currentUser) {
        DisasterAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterAlert", "id", id));
        alert.setStatus(status);
        DisasterAlert updated = alertRepository.save(alert);
        return mapToResponse(updated, currentUser != null ? currentUser.getId() : null);
    }

    @Transactional
    public void deleteAlert(Long id) {
        DisasterAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterAlert", "id", id));
        alertRepository.delete(alert);
    }

    @Transactional(readOnly = true)
    public AlertResponse getAlertById(Long id, Long currentUserId) {
        DisasterAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterAlert", "id", id));
        return mapToResponse(alert, currentUserId);
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveAlerts(Long currentUserId) {
        List<DisasterAlert> alerts = alertRepository.findActiveAlertsPrioritized();
        return alerts.stream()
                .map(alert -> mapToResponse(alert, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAlerts(AlertStatus status, DisasterType disasterType,
                                        SeverityLevel severity, String location, String search,
                                        Long currentUserId) {
        List<DisasterAlert> alerts = alertRepository.filterAlerts(status, disasterType, severity, location, search);
        return alerts.stream()
                .map(alert -> mapToResponse(alert, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertHistory(Long currentUserId) {
        // Fetch all alerts ordered by date desc
        List<DisasterAlert> alerts = alertRepository.findAll();
        alerts.sort((a, b) -> b.getAlertDateTime().compareTo(a.getAlertDateTime()));
        return alerts.stream()
                .map(alert -> mapToResponse(alert, currentUserId))
                .collect(Collectors.toList());
    }

    private AlertResponse mapToResponse(DisasterAlert alert, Long currentUserId) {
        AlertResponse response = AlertResponse.fromEntity(alert);
        response.setReadCount(alertReadStatusRepository.countByAlertId(alert.getId()));

        if (currentUserId != null) {
            Optional<AlertReadStatus> readStatus = alertReadStatusRepository.findByUserIdAndAlertId(currentUserId, alert.getId());
            if (readStatus.isPresent()) {
                response.setIsReadByCurrentUser(true);
                response.setCurrentUserReadAt(readStatus.get().getReadAt());
            } else {
                response.setIsReadByCurrentUser(false);
            }
        }
        return response;
    }
}
