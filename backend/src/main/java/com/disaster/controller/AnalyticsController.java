package com.disaster.controller;

import com.disaster.dto.ApiResponse;
import com.disaster.dto.DashboardStatsResponse;
import com.disaster.dto.UserDashboardStatsResponse;
import com.disaster.security.UserPrincipal;
import com.disaster.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminDashboardStats() {
        DashboardStatsResponse stats = analyticsService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics fetched", stats));
    }

    @GetMapping("/user-dashboard")
    public ResponseEntity<ApiResponse<UserDashboardStatsResponse>> getUserDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDashboardStatsResponse stats = analyticsService.getUserDashboardStats(
                userPrincipal.getId(),
                userPrincipal.getLocation()
        );
        return ResponseEntity.ok(ApiResponse.success("User dashboard statistics fetched", stats));
    }
}
