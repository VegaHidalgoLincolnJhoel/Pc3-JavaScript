package com.Pc3.CyberSentinel.model;

/**
 * Enumeration for incident severity levels
 */
public enum SeverityLevel {
    BAJO("BAJO", 1),
    MEDIO("MEDIO", 2),
    ALTO("ALTO", 3),
    CRITICO("CRITICO", 4);

    private final String label;
    private final int level;

    SeverityLevel(String label, int level) {
        this.label = label;
        this.level = level;
    }

    public String getLabel() {
        return label;
    }

    public int getLevel() {
        return level;
    }

    public static SeverityLevel fromString(String value) {
        for (SeverityLevel severity : SeverityLevel.values()) {
            if (severity.label.equalsIgnoreCase(value)) {
                return severity;
            }
        }
        return BAJO;
    }
}
