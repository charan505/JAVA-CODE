package com.disaster.controller;

import com.disaster.dto.AlertReaderResponse;
import com.disaster.dto.ApiResponse;
import com.disaster.security.UserPrincipal;
import com.disaster.service.AlertReadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertReadController {

    private final AlertReadService alertReadService;

    public AlertReadController(AlertReadService alertReadService) {
        this.alertReadService = alertReadService;
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Boolean>> markAlertAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean result = alertReadService.markAlertAsRead(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Alert marked as acknowledged", result));
    }

    @GetMapping("/my-read-status")
    public ResponseEntity<ApiResponse<List<Long>>> getMyReadAlertIds(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Long> readIds = alertReadService.getAlertIdsReadByUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Read alert IDs fetched", readIds));
    }

    @GetMapping("/{id}/readers")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<AlertReaderResponse>>> getAlertReaders(@PathVariable Long id) {
        List<AlertReaderResponse> readers = alertReadService.getAlertReaders(id);
        return ResponseEntity.ok(ApiResponse.success("Alert acknowledgment list fetched", readers));
    }
}
