import React from 'react';

export default function MetricsGrid({ metrics }) {
  if (!metrics) return null;

  const metricFields = [
    { key: 'intentos_login_fallidos', label: 'Intentos de Login Fallidos', max: 200, unit: '' },
    { key: 'puertos_abiertos', label: 'Puertos Abiertos Detectados', max: 100, unit: '' },
    { key: 'vulnerabilidades_criticas', label: 'Vulnerabilidades Críticas', max: 20, unit: '' },
    { key: 'trafico_anomalo_pct', label: 'Porcentaje de Tráfico Anómalo', max: 100, unit: '%' },
    { key: 'equipos_afectados', label: 'Cantidad de Equipos Afectados', max: 500, unit: '' },
    { key: 'parcheado_pct', label: 'Porcentaje de Equipos Parcheados', max: 100, unit: '%' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      {metricFields.map((field) => {
        const value = metrics[field.key];
        const percentage = (value / field.max) * 100;

        return (
          <div key={field.key} style={{ backgroundColor: '#1f2937', padding: '16px', borderRadius: '12px', border: '1px solid #374151' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>{field.label}</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
              {value}
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#9ca3af', marginLeft: '4px' }}>
                / {field.max}{field.unit}
              </span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#4b5563', height: '6px', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(percentage, 100)}%`, backgroundColor: percentage > 75 ? '#ef4444' : percentage > 40 ? '#f97316' : '#3b82f6' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}