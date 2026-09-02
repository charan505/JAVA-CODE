package com.disaster.controller;

import com.disaster.dto.AlertRequest;
import com.disaster.dto.AlertResponse;
import com.disaster.dto.ApiResponse;
import com.disaster.model.AlertStatus;
import com.disaster.model.DisasterType;
import com.disaster.model.SeverityLevel;
import com.disaster.security.UserPrincipal;
import com.disaster.service.DisasterAlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class DisasterAlertController {

    private final DisasterAlertService alertService;

    public DisasterAlertController(DisasterAlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<AlertResponse> alerts = alertService.getActiveAlerts(userId);
        return ResponseEntity.ok(ApiResponse.success("Active alerts fetched", alerts));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlerts(
            @RequestParam(required = false) AlertStatus status,
            @RequestParam(required = false) DisasterType disasterType,
            @RequestParam(required = false) SeverityLevel severity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<AlertResponse> alerts = alertService.getAlerts(status, disasterType, severity, location, search, userId);
        return ResponseEntity.ok(ApiResponse.success("Alerts fetched", alerts));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlertHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<AlertResponse> alerts = alertService.getAlertHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Alert history fetched", alerts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlertResponse>> getAlertById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        AlertResponse alert = alertService.getAlertById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Alert fetched", alert));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AlertResponse>> createAlert(
            @Valid @RequestBody AlertRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        AlertResponse response = alertService.createAlert(request, userPrincipal);
        return new ResponseEntity<>(ApiResponse.success("Disaster alert broadcasted successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AlertResponse>> updateAlert(
            @PathVariable Long id,
            @Valid @RequestBody AlertRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        AlertResponse response = alertService.updateAlert(id, request, userPrincipal);
        return ResponseEntity.ok(ApiResponse.success("Alert updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AlertResponse>> updateAlertStatus(
            @PathVariable Long id,
            @RequestParam AlertStatus status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        AlertResponse response = alertService.updateAlertStatus(id, status, userPrincipal);
        return ResponseEntity.ok(ApiResponse.success("Alert status updated to " + status, response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.ok(ApiResponse.success("Alert deleted successfully"));
    }
}
