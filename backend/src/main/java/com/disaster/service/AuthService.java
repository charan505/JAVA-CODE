package com.disaster.service;

import com.disaster.dto.*;
import com.disaster.exception.BadRequestException;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.model.AccountStatus;
import com.disaster.model.Role;
import com.disaster.model.User;
import com.disaster.repository.AlertReadStatusRepository;
import com.disaster.repository.UserRepository;
import com.disaster.security.JwtTokenProvider;
import com.disaster.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AlertReadStatusRepository alertReadStatusRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       AlertReadStatusRepository alertReadStatusRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.alertReadStatusRepository = alertReadStatusRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new BadRequestException("Your account is currently inactive. Please contact the administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserResponse userResponse = UserResponse.fromEntity(user);
        userResponse.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(user.getId()));

        return new AuthResponse(jwt, userResponse);
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already in use: " + email);
        }

        Role assignedRole = Role.fromString(registerRequest.getRole());

        User user = new User();
        user.setFullName(registerRequest.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setLocation(registerRequest.getLocation().trim());
        user.setPhone(registerRequest.getPhone() != null ? registerRequest.getPhone().trim() : null);
        user.setRole(assignedRole);
        user.setAccountStatus(AccountStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        String jwt = tokenProvider.generateTokenFromEmail(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getRole().name(),
                savedUser.getLocation()
        );

        UserResponse userResponse = UserResponse.fromEntity(savedUser);
        userResponse.setAlertsAcknowledgedCount(0L);

        return new AuthResponse(jwt, userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        UserResponse response = UserResponse.fromEntity(user);
        response.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(user.getId()));
        return response;
    }

    @Transactional
    public UserResponse updateProfile(UserPrincipal userPrincipal, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        user.setFullName(updateRequest.getFullName().trim());
        user.setLocation(updateRequest.getLocation().trim());
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone().trim());
        }

        if (StringUtils.hasText(updateRequest.getNewPassword())) {
            user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        UserResponse response = UserResponse.fromEntity(updatedUser);
        response.setAlertsAcknowledgedCount(alertReadStatusRepository.countByUserId(updatedUser.getId()));
        return response;
    }
}
