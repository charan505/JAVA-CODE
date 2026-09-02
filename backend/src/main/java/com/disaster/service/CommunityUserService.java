package com.disaster.service;

import com.disaster.dto.UserResponse;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.model.AccountStatus;
import com.disaster.model.Role;
import com.disaster.model.User;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityUserService {

    private final UserRepository userRepository;
    private final AlertReadStatusRepository alertReadStatusRepository;

    public CommunityUserService(UserRepository userRepository, AlertReadStatusRepository alertReadStatusRepository) {
        this.userRepository = userRepository;
        this.alertReadStatusRepository = alertReadStatusRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getCommunityUsers(String location, String search) {
        List<User> users = userRepository.searchCommunityUsers(Role.ROLE_COMMUNITY_USER, location, search);
        return users.stream()
                .map(user -> {
                    UserResponse resp = UserResponse.fromEntity(user);
                    resp.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(user.getId()));
                    return resp;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllLocations() {
        return userRepository.findDistinctLocations();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        UserResponse resp = UserResponse.fromEntity(user);
        resp.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(user.getId()));
        return resp;
    }

    @Transactional
    public UserResponse toggleUserStatus(Long id, AccountStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (status != null) {
            user.setAccountStatus(status);
        } else {
            // Toggle
            user.setAccountStatus(user.getAccountStatus() == AccountStatus.ACTIVE ? AccountStatus.INACTIVE : AccountStatus.ACTIVE);
        }

        User saved = userRepository.save(user);
        UserResponse resp = UserResponse.fromEntity(saved);
        resp.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(saved.getId()));
        return resp;
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }
}
