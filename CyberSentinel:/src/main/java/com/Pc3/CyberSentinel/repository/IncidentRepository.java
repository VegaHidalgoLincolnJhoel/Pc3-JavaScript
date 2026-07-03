package com.Pc3.CyberSentinel.repository;

import com.Pc3.CyberSentinel.model.Incident;
import com.Pc3.CyberSentinel.model.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Incident entity
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    /**
     * Find all incidents with a specific severity level
     */
    List<Incident> findBySeverity(SeverityLevel severity);

    /**
     * Find all incidents created after a specific timestamp
     */
    List<Incident> findByCreatedAtAfter(LocalDateTime createdAt);

    /**
     * Find all incidents by severity level, ordered by creation date descending
     */
    @Query("SELECT i FROM Incident i WHERE i.severity = ?1 ORDER BY i.createdAt DESC")
    List<Incident> findBySeverityOrderByCreatedAtDesc(SeverityLevel severity);

    /**
     * Count incidents by severity level
     */
    long countBySeverity(SeverityLevel severity);

    /**
     * Find critical incidents with high confidence
     */
    @Query("SELECT i FROM Incident i WHERE i.severity = 'CRITICO' AND i.confidence >= 0.8 ORDER BY i.createdAt DESC")
    List<Incident> findCriticalIncidentsWithHighConfidence();
}
