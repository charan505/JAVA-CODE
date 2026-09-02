package com.disaster.service;

import com.disaster.dto.SafetyGuidelineDTO;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.model.DisasterType;
import com.disaster.model.SafetyGuideline;
import com.disaster.repository.SafetyGuidelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SafetyGuidelineService {

    private final SafetyGuidelineRepository guidelineRepository;

    public SafetyGuidelineService(SafetyGuidelineRepository guidelineRepository) {
        this.guidelineRepository = guidelineRepository;
    }

    @Transactional(readOnly = true)
    public List<SafetyGuidelineDTO> getAllGuidelines() {
        return guidelineRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(SafetyGuidelineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SafetyGuidelineDTO getGuidelineByType(DisasterType disasterType) {
        SafetyGuideline guideline = guidelineRepository.findByDisasterType(disasterType)
                .orElseThrow(() -> new ResourceNotFoundException("SafetyGuideline", "disasterType", disasterType));
        return SafetyGuidelineDTO.fromEntity(guideline);
    }

    @Transactional
    public SafetyGuidelineDTO saveOrUpdateGuideline(SafetyGuidelineDTO dto) {
        SafetyGuideline guideline = guidelineRepository.findByDisasterType(dto.getDisasterType())
                .orElse(new SafetyGuideline());

        guideline.setDisasterType(dto.getDisasterType());
        guideline.setTitle(dto.getTitle());
        guideline.setDescription(dto.getDescription());
        guideline.setDos(dto.getDos());
        guideline.setDonts(dto.getDonts());
        guideline.setEmergencyKitItems(dto.getEmergencyKitItems());
        guideline.setIconName(dto.getIconName());
        if (dto.getOrderIndex() != null) {
            guideline.setOrderIndex(dto.getOrderIndex());
        }

        SafetyGuideline saved = guidelineRepository.save(guideline);
        return SafetyGuidelineDTO.fromEntity(saved);
    }
}
