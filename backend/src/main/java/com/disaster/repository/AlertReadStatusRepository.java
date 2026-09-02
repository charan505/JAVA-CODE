package com.disaster.repository;

import com.disaster.model.AlertReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertReadStatusRepository extends JpaRepository<AlertReadStatus, Long> {

    boolean existsByUserIdAndAlertId(Long userId, Long alertId);

    Optional<AlertReadStatus> findByUserIdAndAlertId(Long userId, Long alertId);

    List<AlertReadStatus> findByUserId(Long userId);

    List<AlertReadStatus> findByAlertIdOrderByReadAtDesc(Long alertId);

    long countByAlertId(Long alertId);

    long countByUserId(Long userId);

    @Query("SELECT r.alert.id FROM AlertReadStatus r WHERE r.user.id = :userId")
    List<Long> findAlertIdsReadByUserId(@Param("userId") Long userId);
}
