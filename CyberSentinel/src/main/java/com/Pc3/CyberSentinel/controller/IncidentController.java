package com.Pc3.CyberSentinel.controller;

import com.Pc3.CyberSentinel.model.Incident;
import com.Pc3.CyberSentinel.model.SeverityLevel;
import com.Pc3.CyberSentinel.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

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

    // Pasarela hacia el servicio Python (FastAPI) que ejecuta el modelo entrenado
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PYTHON_URL = "http://localhost:8001";

    /**
     * POST /api/cyber-sentinel/predict
     * Recibe las métricas desde React, las reenvía tal cual al servicio de IA
     * en Python (FastAPI) y devuelve la respuesta real del modelo (predicción,
     * confianza, ranking y recomendaciones) sin modificarla ni persistirla.
     *
     * Flujo: React -> Spring Boot (esta pasarela) -> Python /predict/cyber-sentinel -> Spring Boot -> React
     *
     * @param datos Las métricas del incidente, en snake_case, tal como las espera Python
     * @return La respuesta JSON cruda que devuelve el modelo de Python
     */
    @PostMapping("/predict")
    public ResponseEntity<String> predictIncident(@RequestBody Map<String, Object> datos) {
        String url = PYTHON_URL + "/predict/cyber-sentinel";
        try {
            String respuestaPython = restTemplate.postForObject(url, datos, String.class);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(respuestaPython);

        } catch (HttpStatusCodeException e) {
            // Python respondió con un error (ej. 422 por validación de rangos con Pydantic)
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(e.getResponseBodyAsString());

        } catch (ResourceAccessException e) {
            // Python no está corriendo o no responde en el puerto 8001
            String errorJson = "{\"error\":\"No se pudo conectar con el servicio de IA (Python).\"," +
                    "\"url\":\"" + url + "\"," +
                    "\"detail\":\"Verifica que uvicorn esté corriendo en el puerto 8001 (uvicorn app:app --reload --port 8001).\"}";
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorJson);

        } catch (RestClientException e) {
            String errorJson = "{\"error\":\"Error inesperado al consumir el servicio de IA.\"," +
                    "\"detail\":\"" + e.getMessage().replace("\"", "'") + "\"}";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorJson);
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
