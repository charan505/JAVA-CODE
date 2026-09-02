package com.disaster.model;

import jakarta.persistence.*;

@Entity
@Table(name = "safety_guidelines")
public class SafetyGuideline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "disaster_type", nullable = false, unique = true, length = 40)
    private DisasterType disasterType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String dos;

    @Column(columnDefinition = "TEXT")
    private String donts;

    @Column(name = "emergency_kit_items", columnDefinition = "TEXT")
    private String emergencyKitItems;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    public SafetyGuideline() {
    }

    public SafetyGuideline(DisasterType disasterType, String title, String description, String dos, String donts, String emergencyKitItems, String iconName, Integer orderIndex) {
        this.disasterType = disasterType;
        this.title = title;
        this.description = description;
        this.dos = dos;
        this.donts = donts;
        this.emergencyKitItems = emergencyKitItems;
        this.iconName = iconName;
        this.orderIndex = orderIndex;
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
