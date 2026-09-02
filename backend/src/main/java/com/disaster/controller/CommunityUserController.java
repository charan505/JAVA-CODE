package com.disaster.controller;

import com.disaster.dto.ApiResponse;
import com.disaster.dto.UserResponse;
import com.disaster.model.AccountStatus;
import com.disaster.service.CommunityUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class CommunityUserController {

    private final CommunityUserService communityUserService;

    public CommunityUserController(CommunityUserService communityUserService) {
        this.communityUserService = communityUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getCommunityUsers(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search) {
        List<UserResponse> users = communityUserService.getCommunityUsers(location, search);
        return ResponseEntity.ok(ApiResponse.success("Community users fetched", users));
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<String>>> getLocations() {
        List<String> locations = communityUserService.getAllLocations();
        return ResponseEntity.ok(ApiResponse.success("Distinct locations fetched", locations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = communityUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User fetched", user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam(required = false) AccountStatus status) {
        UserResponse user = communityUserService.toggleUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated to " + user.getAccountStatus(), user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        communityUserService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }
}
