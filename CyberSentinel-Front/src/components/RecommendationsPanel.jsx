import React from 'react';

export default function RecommendationsPanel({ incident }) {
  if (!incident) return null;
  const { prediction, metrics } = incident;

  const getActionContent = () => {
    switch (prediction) {
      case 'CRITICO':
        return {
          title: "🚨 ESCALAMIENTO INMEDIATO REQUERIDO",
          borderColor: '#ef4444',
          backgroundColor: '#451a03',
          color: '#fecdd3',
          justification: `Alerta Crítica detectada. Se justifica el escalamiento debido a que los equipos comprometidos (${metrics.equipos_afectados}) están en un nivel alarmante, con un bajo índice de parches (${metrics.parcheado_pct}%) y vulnerabilidades críticas activas (${metrics.vulnerabilidades_criticas}/20).`,
          steps: ["Aislar la subred de los equipos afectados.", "Notificar al comité de incidentes críticos de nivel 3.", "Iniciar análisis forense de autenticaciones."]
        };
      case 'ALTO':
        return {
          title: "⚠️ ATENCIÓN PRIORITARIA",
          borderColor: '#f97316',
          backgroundColor: '#431407',
          color: '#ffedd5',
          justification: "El tráfico anómalo elevado y los puertos expuestos requieren atención en las próximas 2 horas por el equipo de guardia.",
          steps: ["Bloquear temporalmente las IPs origen.", "Auditar los puertos abiertos."]
        };
      default:
        return {
          title: "✅ MONITOREO ESTÁNDAR",
          borderColor: '#374151',
          backgroundColor: '#1f2937',
          color: '#d1d5db',
          justification: "Métricas dentro de los rangos operacionales seguros. Mantener observación pasiva.",
          steps: ["Continuar con los flujos de revisión programados."]
        };
    }
  };

  const content = getActionContent();

  return (
    <div style={{ border: `1px solid ${content.borderColor}`, backgroundColor: content.backgroundColor, color: content.color, padding: '20px', borderRadius: '12px', height: '100%' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>{content.title}</h3>
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Justificación:</h4>
        <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{content.justification}</p>
      </div>
      <div>
        <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Plan de Respuesta:</h4>
        <ul style={{ paddingLeft: '20px', fontSize: '14px', margin: 0 }}>
          {content.steps.map((step, idx) => <li key={idx} style={{ marginTop: '4px' }}>{step}</li>)}
        </ul>
      </div>
    </div>
  );
}