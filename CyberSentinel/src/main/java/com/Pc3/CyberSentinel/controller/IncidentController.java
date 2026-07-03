package com.Pc3.CyberSentinel.controller;

import com.Pc3.CyberSentinel.dto.IncidentDataDTO;
import com.Pc3.CyberSentinel.dto.PredictionResponseDTO;
import com.Pc3.CyberSentinel.model.Incident;
import com.Pc3.CyberSentinel.model.SeverityLevel;
import com.Pc3.CyberSentinel.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Cybersecurity Incident Prediction
 * Endpoints for predicting and managing security incidents
 */
@RestController
@RequestMapping("/api/cyber-sentinel")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    /**
     * POST /api/cyber-sentinel/predict
     * Predict severity level for a security incident
     *
     * @param incidentData The incident metrics
     * @return Prediction response with severity, confidence, and recommendations
     */
    @PostMapping("/predict")
    public ResponseEntity<PredictionResponseDTO> predictIncident(@Valid @RequestBody IncidentDataDTO incidentData) {
        try {
            PredictionResponseDTO prediction = incidentService.procesIncident(incidentData);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/cyber-sentinel/incidents
     * Retrieve all incidents
     *
     * @return List of all incidents
     */
    @GetMapping("/incidents")
    public ResponseEntity<List<Incident>> getAllIncidents() {
        List<Incident> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }

    /**
     * GET /api/cyber-sentinel/incidents/{id}
     * Retrieve incident by ID
     *
     * @param id The incident ID
     * @return The incident
     */
    @GetMapping("/incidents/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        Incident incident = incidentService.getIncidentById(id);
        if (incident != null) {
            return ResponseEntity.ok(incident);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * GET /api/cyber-sentinel/incidents/severity/{severity}
     * Retrieve incidents by severity level
     *
     * @param severity The severity level (BAJO, MEDIO, ALTO, CRITICO)
     * @return List of incidents with specified severity
     */
    @GetMapping("/incidents/severity/{severity}")
    public ResponseEntity<List<Incident>> getIncidentsBySeverity(@PathVariable String severity) {
        try {
            SeverityLevel level = SeverityLevel.fromString(severity);
            List<Incident> incidents = incidentService.getIncidentsBySeverity(level);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/cyber-sentinel/critical-incidents
     * Retrieve critical incidents with high confidence
     *
     * @return List of critical incidents
     */
    @GetMapping("/critical-incidents")
    public ResponseEntity<List<Incident>> getCriticalIncidents() {
        List<Incident> incidents = incidentService.getCriticalIncidents();
        return ResponseEntity.ok(incidents);
    }

    /**
     * GET /api/cyber-sentinel/statistics
     * Get incident statistics and metrics
     *
     * @return Statistics object with counts by severity
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        IncidentService.IncidentStatistics stats = incidentService.getStatistics();

        Map<String, Object> response = new HashMap<>();
        response.put("total", stats.getTotal());
        response.put("critico", stats.getCritico());
        response.put("alto", stats.getAlto());
        response.put("medio", stats.getMedio());
        response.put("bajo", stats.getBajo());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/cyber-sentinel/health
     * Health check endpoint
     *
     * @return Health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "CyberSentinel - Incident Prioritization Service");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    /**
     * Exception handler for validation errors
     */
    @ExceptionHandler
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("status", "ERROR");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
