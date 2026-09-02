package com.disaster.repository;

import com.disaster.model.AlertStatus;
import com.disaster.model.DisasterAlert;
import com.disaster.model.DisasterType;
import com.disaster.model.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterAlertRepository extends JpaRepository<DisasterAlert, Long> {

    List<DisasterAlert> findByStatusOrderByAlertDateTimeDesc(AlertStatus status);

    @Query("SELECT a FROM DisasterAlert a WHERE a.status = 'ACTIVE' ORDER BY " +
           "CASE a.severity " +
           "  WHEN 'CRITICAL' THEN 1 " +
           "  WHEN 'HIGH' THEN 2 " +
           "  WHEN 'MEDIUM' THEN 3 " +
           "  WHEN 'LOW' THEN 4 " +
           "  ELSE 5 END ASC, a.alertDateTime DESC")
    List<DisasterAlert> findActiveAlertsPrioritized();

    @Query("SELECT a FROM DisasterAlert a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:disasterType IS NULL OR a.disasterType = :disasterType) AND " +
           "(:severity IS NULL OR a.severity = :severity) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(a.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.location) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.alertDateTime DESC")
    List<DisasterAlert> filterAlerts(@Param("status") AlertStatus status,
                                    @Param("disasterType") DisasterType disasterType,
                                    @Param("severity") SeverityLevel severity,
                                    @Param("location") String location,
                                    @Param("search") String search);

    long countByStatus(AlertStatus status);

    long countBySeverity(SeverityLevel severity);

    long countByDisasterType(DisasterType disasterType);

    long countByStatusAndSeverity(AlertStatus status, SeverityLevel severity);

    @Query("SELECT a.disasterType, COUNT(a) FROM DisasterAlert a GROUP BY a.disasterType")
    List<Object[]> countAlertsByDisasterType();

    @Query("SELECT a.severity, COUNT(a) FROM DisasterAlert a GROUP BY a.severity")
    List<Object[]> countAlertsBySeverity();

    @Query("SELECT a.status, COUNT(a) FROM DisasterAlert a GROUP BY a.status")
    List<Object[]> countAlertsByStatus();

    List<DisasterAlert> findTop5ByOrderByAlertDateTimeDesc();
}
