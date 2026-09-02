package com.disaster.service;

import com.disaster.dto.AlertReaderResponse;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.model.AlertReadStatus;
import com.disaster.model.DisasterAlert;
import com.disaster.model.User;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.DisasterAlertRepository;
import com.disaster.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertReadService {

    private final AlertReadStatusRepository alertReadStatusRepository;
    private final DisasterAlertRepository disasterAlertRepository;
    private final UserRepository userRepository;

    public AlertReadService(AlertReadStatusRepository alertReadStatusRepository,
                            DisasterAlertRepository disasterAlertRepository,
                            UserRepository userRepository) {
        this.alertReadStatusRepository = alertReadStatusRepository;
        this.disasterAlertRepository = disasterAlertRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean markAlertAsRead(Long alertId, Long userId) {
        if (alertReadStatusRepository.existsByUserIdAndAlertId(userId, alertId)) {
            return true; // Already marked as read
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        DisasterAlert alert = disasterAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("DisasterAlert", "id", alertId));

        AlertReadStatus readStatus = new AlertReadStatus(user, alert, LocalDateTime.now());
        alertReadStatusRepository.save(readStatus);
        return true;
    }

    @Transactional(readOnly = true)
    public List<Long> getAlertIdsReadByUser(Long userId) {
        return alertReadStatusRepository.findAlertIdsReadByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<AlertReaderResponse> getAlertReaders(Long alertId) {
        List<AlertReadStatus> readStatuses = alertReadStatusRepository.findByAlertIdOrderByReadAtDesc(alertId);
        return readStatuses.stream()
                .map(status -> new AlertReaderResponse(
                        status.getUser().getId(),
                        status.getUser().getFullName(),
                        status.getUser().getEmail(),
                        status.getUser().getLocation(),
                        status.getReadAt()
                ))
                .collect(Collectors.toList());
    }
}
