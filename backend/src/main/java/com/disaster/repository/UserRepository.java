package com.disaster.repository;

import com.disaster.model.AccountStatus;
import com.disaster.model.Role;
import com.disaster.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    long countByAccountStatus(AccountStatus accountStatus);

    @Query("SELECT DISTINCT u.location FROM User u WHERE u.location IS NOT NULL AND u.location <> '' ORDER BY u.location")
    List<String> findDistinctLocations();

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(:location IS NULL OR :location = '' OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY u.createdAt DESC")
    List<User> searchCommunityUsers(@Param("role") Role role,
                                   @Param("location") String location,
                                   @Param("search") String search);
}
