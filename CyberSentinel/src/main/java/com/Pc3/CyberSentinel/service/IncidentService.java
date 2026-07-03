package com.Pc3.CyberSentinel.service;

import com.Pc3.CyberSentinel.dto.IncidentDataDTO;
import com.Pc3.CyberSentinel.dto.PredictionResponseDTO;
import com.Pc3.CyberSentinel.model.Incident;
import com.Pc3.CyberSentinel.model.SeverityLevel;
import com.Pc3.CyberSentinel.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing security incidents
 */
@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private MLPredictionService mlPredictionService;

    /**
     * Process an incident and generate a prediction
     *
     * @param incidentData The incident data
     * @return Prediction response with severity, confidence, and recommendations
     */
    @Transactional
    public PredictionResponseDTO procesIncident(IncidentDataDTO incidentData) {
        // Get prediction from ML service
        MLPredictionService.PredictionResult prediction = mlPredictionService.predictSeverity(incidentData);
        SeverityLevel severity = prediction.getSeverity();
        double confidence = prediction.getConfidence();

        // Generate recommendations
        String recommendations = mlPredictionService.generateRecommendations(incidentData, severity);

        // Save incident to database
        Incident incident = new Incident();
        incident.setIntentosLoginFallidos(incidentData.getIntentosLoginFallidos());
        incident.setPuertosAbiertos(incidentData.getPuertosAbiertos());
        incident.setVulnerabilidadesCriticas(incidentData.getVulnerabilidadesCriticas());
        incident.setTraficoAnomoloPct(incidentData.getTraficoAnomoloPct());
        incident.setEquiposAfectados(incidentData.getEquiposAfectados());
        incident.setParchaeadoPct(incidentData.getParchaeadoPct());
        incident.setSeverity(severity);
        incident.setConfidence(confidence);
        incident.setRecommendations(recommendations);

        incidentRepository.save(incident);

        // Build response
        PredictionResponseDTO response = new PredictionResponseDTO();
        response.setSeverity(severity);
        response.setPrediction(severity.getLabel());
        response.setConfidence(confidence);
        response.setRecommendations(recommendations);

        return response;
    }

    /**
     * Retrieve all incidents
     *
     * @return List of all incidents
     */
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    /**
     * Retrieve incident by ID
     *
     * @param id The incident ID
     * @return The incident or null if not found
     */
    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id).orElse(null);
    }

    /**
     * Retrieve incidents by severity level
     *
     * @param severity The severity level
     * @return List of incidents with the specified severity
     */
    public List<Incident> getIncidentsBySeverity(SeverityLevel severity) {
        return incidentRepository.findBySeverityOrderByCreatedAtDesc(severity);
    }

    /**
     * Get critical incidents with high confidence
     *
     * @return List of critical incidents
     */
    public List<Incident> getCriticalIncidents() {
        return incidentRepository.findCriticalIncidentsWithHighConfidence();
    }

    /**
     * Count incidents by severity level
     *
     * @param severity The severity level
     * @return Count of incidents
     */
    public long countBySeverity(SeverityLevel severity) {
        return incidentRepository.countBySeverity(severity);
    }

    /**
     * Get incident statistics
     *
     * @return Statistics object
     */
    public IncidentStatistics getStatistics() {
        return new IncidentStatistics(
                incidentRepository.count(),
                incidentRepository.countBySeverity(SeverityLevel.CRITICO),
                incidentRepository.countBySeverity(SeverityLevel.ALTO),
                incidentRepository.countBySeverity(SeverityLevel.MEDIO),
                incidentRepository.countBySeverity(SeverityLevel.BAJO)
        );
    }

    /**
     * Inner class to hold incident statistics
     */
    public static class IncidentStatistics {
        private final long total;
        private final long critico;
        private final long alto;
        private final long medio;
        private final long bajo;

        public IncidentStatistics(long total, long critico, long alto, long medio, long bajo) {
            this.total = total;
            this.critico = critico;
            this.alto = alto;
            this.medio = medio;
            this.bajo = bajo;
        }

        public long getTotal() {
            return total;
        }

        public long getCritico() {
            return critico;
        }

        public long getAlto() {
            return alto;
        }

        public long getMedio() {
            return medio;
        }

        public long getBajo() {
            return bajo;
        }
    }
}
