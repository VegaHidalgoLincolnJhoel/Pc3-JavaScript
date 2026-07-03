package com.Pc3.CyberSentinel.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for Incident Data Request
 * Represents security incident metrics to be analyzed
 */
public class IncidentDataDTO {

    @NotNull(message = "intentos_login_fallidos cannot be null")
    @Min(value = 0, message = "intentos_login_fallidos must be >= 0")
    @Max(value = 200, message = "intentos_login_fallidos must be <= 200")
    private Integer intentos_login_fallidos;

    @NotNull(message = "puertos_abiertos cannot be null")
    @Min(value = 0, message = "puertos_abiertos must be >= 0")
    @Max(value = 100, message = "puertos_abiertos must be <= 100")
    private Integer puertos_abiertos;

    @NotNull(message = "vulnerabilidades_criticas cannot be null")
    @Min(value = 0, message = "vulnerabilidades_criticas must be >= 0")
    @Max(value = 20, message = "vulnerabilidades_criticas must be <= 20")
    private Integer vulnerabilidades_criticas;

    @NotNull(message = "trafico_anomalo_pct cannot be null")
    @Min(value = 0, message = "trafico_anomalo_pct must be >= 0")
    @Max(value = 100, message = "trafico_anomalo_pct must be <= 100")
    private Integer trafico_anomalo_pct;

    @NotNull(message = "equipos_afectados cannot be null")
    @Min(value = 0, message = "equipos_afectados must be >= 0")
    @Max(value = 500, message = "equipos_afectados must be <= 500")
    private Integer equipos_afectados;

    @NotNull(message = "parcheado_pct cannot be null")
    @Min(value = 0, message = "parcheado_pct must be >= 0")
    @Max(value = 100, message = "parcheado_pct must be <= 100")
    private Integer parcheado_pct;

    // Constructors
    public IncidentDataDTO() {}

    public IncidentDataDTO(Integer intentos_login_fallidos, Integer puertos_abiertos,
                           Integer vulnerabilidades_criticas, Integer trafico_anomalo_pct,
                           Integer equipos_afectados, Integer parcheado_pct) {
        this.intentos_login_fallidos = intentos_login_fallidos;
        this.puertos_abiertos = puertos_abiertos;
        this.vulnerabilidades_criticas = vulnerabilidades_criticas;
        this.trafico_anomalo_pct = trafico_anomalo_pct;
        this.equipos_afectados = equipos_afectados;
        this.parcheado_pct = parcheado_pct;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "IncidentDataDTO{" +
                "intentos_login_fallidos=" + intentos_login_fallidos +
                ", puertos_abiertos=" + puertos_abiertos +
                ", vulnerabilidades_criticas=" + vulnerabilidades_criticas +
                ", trafico_anomalo_pct=" + trafico_anomalo_pct +
                ", equipos_afectados=" + equipos_afectados +
                ", parcheado_pct=" + parcheado_pct +
                '}';
    }
}
