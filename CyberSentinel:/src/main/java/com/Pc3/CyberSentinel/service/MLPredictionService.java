package com.Pc3.CyberSentinel.service;

import com.Pc3.CyberSentinel.dto.IncidentDataDTO;
import com.Pc3.CyberSentinel.model.SeverityLevel;
import org.springframework.stereotype.Service;

/**
 * Machine Learning Service for Incident Severity Prediction
 * Uses a weighted scoring algorithm to predict incident severity levels
 */
@Service
public class MLPredictionService {

    /**
     * Predicts the severity level of a security incident based on provided metrics
     *
     * @param incidentData The incident data containing security metrics
     * @return A tuple with severity level and confidence score
     */
    public PredictionResult predictSeverity(IncidentDataDTO incidentData) {
        // Normalize metrics to 0-1 scale
        double normalizedLoginFails = incidentData.getIntentosLoginFallidos() / 200.0;
        double normalizedOpenPorts = incidentData.getPuertosAbiertos() / 100.0;
        double normalizedCriticalVulns = incidentData.getVulnerabilidadesCriticas() / 20.0;
        double normalizedAnomalousTraffic = incidentData.getTraficoAnomoloPct() / 100.0;
        double normalizedAffectedEquipment = incidentData.getEquiposAfectados() / 500.0;
        double normalizedUnpatched = 1.0 - (incidentData.getParchaeadoPct() / 100.0); // Inverse: more unpatched = more risk

        // Assign weights to each metric (must sum to 1.0)
        double weightLoginFails = 0.15;
        double weightOpenPorts = 0.15;
        double weightCriticalVulns = 0.25;
        double weightAnomalousTraffic = 0.15;
        double weightAffectedEquipment = 0.15;
        double weightUnpatched = 0.15;

        // Calculate weighted risk score (0-1)
        double riskScore = (normalizedLoginFails * weightLoginFails) +
                (normalizedOpenPorts * weightOpenPorts) +
                (normalizedCriticalVulns * weightCriticalVulns) +
                (normalizedAnomalousTraffic * weightAnomalousTraffic) +
                (normalizedAffectedEquipment * weightAffectedEquipment) +
                (normalizedUnpatched * weightUnpatched);

        // Determine severity level based on risk score thresholds
        SeverityLevel severity;
        if (riskScore < 0.25) {
            severity = SeverityLevel.BAJO;
        } else if (riskScore < 0.50) {
            severity = SeverityLevel.MEDIO;
        } else if (riskScore < 0.75) {
            severity = SeverityLevel.ALTO;
        } else {
            severity = SeverityLevel.CRITICO;
        }

        // Calculate confidence (higher when metrics are more extreme)
        double confidence = calculateConfidence(
                normalizedLoginFails, normalizedOpenPorts, normalizedCriticalVulns,
                normalizedAnomalousTraffic, normalizedAffectedEquipment, normalizedUnpatched
        );

        return new PredictionResult(severity, riskScore, confidence);
    }

    /**
     * Calculates confidence score for the prediction
     */
    private double calculateConfidence(double... normalizedMetrics) {
        // Confidence is higher when metrics are more extreme (closer to 0 or 1)
        double variance = 0;
        for (double metric : normalizedMetrics) {
            variance += Math.pow(metric - 0.5, 2);
        }
        variance /= normalizedMetrics.length;

        // Map variance to confidence (0.5 to 1.0)
        return Math.min(1.0, 0.5 + (variance * 2));
    }

    /**
     * Generates recommendations based on the incident severity and data
     */
    public String generateRecommendations(IncidentDataDTO incidentData, SeverityLevel severity) {
        StringBuilder recommendations = new StringBuilder();

        switch (severity) {
            case BAJO:
                recommendations.append("Monitor the situation. ");
                if (incidentData.getIntentosLoginFallidos() > 50) {
                    recommendations.append("Review authentication logs. ");
                }
                break;

            case MEDIO:
                recommendations.append("Review and escalate if needed. ");
                if (incidentData.getVulnerabilidadesCriticas() > 5) {
                    recommendations.append("Prioritize critical vulnerability patches. ");
                }
                if (incidentData.getParchaeadoPct() < 80) {
                    recommendations.append("Increase patching efforts. ");
                }
                break;

            case ALTO:
                recommendations.append("Escalate immediately to security team. ");
                recommendations.append("Investigate affected systems. ");
                if (incidentData.getTraficoAnomoloPct() > 50) {
                    recommendations.append("Monitor network traffic patterns. ");
                }
                if (incidentData.getEquiposAfectados() > 100) {
                    recommendations.append("Consider isolating affected equipment. ");
                }
                break;

            case CRITICO:
                recommendations.append("CRITICAL: Activate incident response plan immediately. ");
                recommendations.append("Isolate affected systems. ");
                recommendations.append("Engage security incident response team. ");
                recommendations.append("Prepare for potential containment measures. ");
                recommendations.append("Document all actions taken.");
                break;
        }

        return recommendations.toString();
    }

    /**
     * Inner class to hold prediction results
     */
    public static class PredictionResult {
        private final SeverityLevel severity;
        private final double riskScore;
        private final double confidence;

        public PredictionResult(SeverityLevel severity, double riskScore, double confidence) {
            this.severity = severity;
            this.riskScore = riskScore;
            this.confidence = Math.round(confidence * 100.0) / 100.0; // Round to 2 decimals
        }

        public SeverityLevel getSeverity() {
            return severity;
        }

        public double getRiskScore() {
            return riskScore;
        }

        public double getConfidence() {
            return confidence;
        }
    }
}
