package com.Pc3.CyberSentinel.dto;

import com.Pc3.CyberSentinel.model.SeverityLevel;

/**
 * DTO for Incident Prediction Response
 */
public class PredictionResponseDTO {

    private SeverityLevel severity;
    private String prediction;
    private Double confidence;
    private String recommendations;
    private Long timestamp;

    // Constructors
    public PredictionResponseDTO() {
        this.timestamp = System.currentTimeMillis();
    }

    public PredictionResponseDTO(SeverityLevel severity, String prediction, Double confidence, String recommendations) {
        this.severity = severity;
        this.prediction = prediction;
        this.confidence = confidence;
        this.recommendations = recommendations;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters and Setters
    public SeverityLevel getSeverity() {
        return severity;
    }

    public void setSeverity(SeverityLevel severity) {
        this.severity = severity;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "PredictionResponseDTO{" +
                "severity=" + severity +
                ", prediction='" + prediction + '\'' +
                ", confidence=" + confidence +
                ", recommendations='" + recommendations + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
