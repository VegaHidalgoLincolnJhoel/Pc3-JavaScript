package com.Pc3.CyberSentinel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a Security Incident
 */
@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer intentos_login_fallidos;

    @Column(nullable = false)
    private Integer puertos_abiertos;

    @Column(nullable = false)
    private Integer vulnerabilidades_criticas;

    @Column(nullable = false)
    private Integer trafico_anomalo_pct;

    @Column(nullable = false)
    private Integer equipos_afectados;

    @Column(nullable = false)
    private Integer parcheado_pct;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeverityLevel severity;

    @Column(nullable = false)
    private Double confidence;

    @Column(length = 1000)
    private String recommendations;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public Incident() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIntentosLoginFallidos() {
        return intentos_login_fallidos;
    }

    public void setIntentosLoginFallidos(Integer intentos_login_fallidos) {
        this.intentos_login_fallidos = intentos_login_fallidos;
    }

    public Integer getPuertosAbiertos() {
        return puertos_abiertos;
    }

    public void setPuertosAbiertos(Integer puertos_abiertos) {
        this.puertos_abiertos = puertos_abiertos;
    }

    public Integer getVulnerabilidadesCriticas() {
        return vulnerabilidades_criticas;
    }

    public void setVulnerabilidadesCriticas(Integer vulnerabilidades_criticas) {
        this.vulnerabilidades_criticas = vulnerabilidades_criticas;
    }

    public Integer getTraficoAnomoloPct() {
        return trafico_anomalo_pct;
    }

    public void setTraficoAnomoloPct(Integer trafico_anomalo_pct) {
        this.trafico_anomalo_pct = trafico_anomalo_pct;
    }

    public Integer getEquiposAfectados() {
        return equipos_afectados;
    }

    public void setEquiposAfectados(Integer equipos_afectados) {
        this.equipos_afectados = equipos_afectados;
    }

    public Integer getParchaeadoPct() {
        return parcheado_pct;
    }

    public void setParchaeadoPct(Integer parcheado_pct) {
        this.parcheado_pct = parcheado_pct;
    }

    public SeverityLevel getSeverity() {
        return severity;
    }

    public void setSeverity(SeverityLevel severity) {
        this.severity = severity;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Incident{" +
                "id=" + id +
                ", intentos_login_fallidos=" + intentos_login_fallidos +
                ", puertos_abiertos=" + puertos_abiertos +
                ", vulnerabilidades_criticas=" + vulnerabilidades_criticas +
                ", trafico_anomalo_pct=" + trafico_anomalo_pct +
                ", equipos_afectados=" + equipos_afectados +
                ", parcheado_pct=" + parcheado_pct +
                ", severity=" + severity +
                ", confidence=" + confidence +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
