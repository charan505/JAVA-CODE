package com.disaster.dto;

import com.disaster.model.DisasterType;
import com.disaster.model.SafetyGuideline;

public class SafetyGuidelineDTO {

    private Long id;
    private DisasterType disasterType;
    private String title;
    private String description;
    private String dos;
    private String donts;
    private String emergencyKitItems;
    private String iconName;
    private Integer orderIndex;

    public SafetyGuidelineDTO() {
    }

    public static SafetyGuidelineDTO fromEntity(SafetyGuideline entity) {
        if (entity == null) return null;
        SafetyGuidelineDTO dto = new SafetyGuidelineDTO();
        dto.setId(entity.getId());
        dto.setDisasterType(entity.getDisasterType());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setDos(entity.getDos());
        dto.setDonts(entity.getDonts());
        dto.setEmergencyKitItems(entity.getEmergencyKitItems());
        dto.setIconName(entity.getIconName());
        dto.setOrderIndex(entity.getOrderIndex());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DisasterType getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(DisasterType disasterType) {
        this.disasterType = disasterType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDos() {
        return dos;
    }

    public void setDos(String dos) {
        this.dos = dos;
    }

    public String getDonts() {
        return donts;
    }

    public void setDonts(String donts) {
        this.donts = donts;
    }

    public String getEmergencyKitItems() {
        return emergencyKitItems;
    }

    public void setEmergencyKitItems(String emergencyKitItems) {
        this.emergencyKitItems = emergencyKitItems;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
