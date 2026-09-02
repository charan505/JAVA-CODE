package com.disaster.repository;

import com.disaster.model.DisasterType;
import com.disaster.model.SafetyGuideline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SafetyGuidelineRepository extends JpaRepository<SafetyGuideline, Long> {

    Optional<SafetyGuideline> findByDisasterType(DisasterType disasterType);

    List<SafetyGuideline> findAllByOrderByOrderIndexAsc();
}
