package com.disaster.controller;

import com.disaster.dto.ApiResponse;
import com.disaster.dto.SafetyGuidelineDTO;
import com.disaster.model.DisasterType;
import com.disaster.service.SafetyGuidelineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safety-guidelines")
public class SafetyGuidelineController {

    private final SafetyGuidelineService guidelineService;

    public SafetyGuidelineController(SafetyGuidelineService guidelineService) {
        this.guidelineService = guidelineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SafetyGuidelineDTO>>> getAllGuidelines() {
        List<SafetyGuidelineDTO> list = guidelineService.getAllGuidelines();
        return ResponseEntity.ok(ApiResponse.success("Safety guidelines fetched", list));
    }

    @GetMapping("/{disasterType}")
    public ResponseEntity<ApiResponse<SafetyGuidelineDTO>> getGuidelineByType(@PathVariable DisasterType disasterType) {
        SafetyGuidelineDTO dto = guidelineService.getGuidelineByType(disasterType);
        return ResponseEntity.ok(ApiResponse.success("Safety guideline fetched for " + disasterType, dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SafetyGuidelineDTO>> saveOrUpdateGuideline(@Valid @RequestBody SafetyGuidelineDTO dto) {
        SafetyGuidelineDTO saved = guidelineService.saveOrUpdateGuideline(dto);
        return ResponseEntity.ok(ApiResponse.success("Safety guideline saved successfully", saved));
    }
}
