import React, { useState, useEffect } from 'react';
import MetricsGrid from './MetricsGrid';
import RecommendationsPanel from './RecommendationsPanel';

// CONFIGURACIÓN: Cambia a true cuando quieras conectarte con el backend real de tu grupo
const USAR_BACKEND_REAL = false; 
const BASE_URL = "http://localhost:8080/api/cyber-sentinel";

// snake_case (frontend) -> camelCase con typos (backend real)
const toBackendMetrics = (metrics) => ({
  intentosLoginFallidos: metrics.intentos_login_fallidos,
  puertosAbiertos: metrics.puertos_abiertos,
  vulnerabilidadesCriticas: metrics.vulnerabilidades_criticas,
  traficoAnomoloPct: metrics.trafico_anomalo_pct,
  equiposAfectados: metrics.equipos_afectados,
  parchaeadoPct: metrics.parcheado_pct,
});

// camelCase con typos (backend real) -> snake_case (frontend)
const toFrontendMetrics = (inc) => ({
  intentos_login_fallidos: inc.intentosLoginFallidos,
  puertos_abiertos: inc.puertosAbiertos,
  vulnerabilidades_criticas: inc.vulnerabilidadesCriticas,
  trafico_anomalo_pct: inc.traficoAnomoloPct,
  equipos_afectados: inc.equiposAfectados,
  parcheado_pct: inc.parchaeadoPct,
});

// Casos locales idénticos a los del API para simulación o envío
const mockIncidents = [
  { 
    id: "INC-SIM-001", 
    timestamp: "2026-07-04 09:00", 
    prediction: "BAJO", 
    metrics: { intentos_login_fallidos: 15, puertos_abiertos: 5, vulnerabilidades_criticas: 1, trafico_anomalo_pct: 12, equipos_afectados: 2, parcheado_pct: 98 } 
  },
  { 
    id: "INC-SIM-002", 
    timestamp: "2026-07-04 10:15", 
    prediction: "ALTO", 
    metrics: { intentos_login_fallidos: 120, puertos_abiertos: 35, vulnerabilidades_criticas: 8, trafico_anomalo_pct: 76, equipos_afectados: 90, parcheado_pct: 48 } 
  },
  { 
    id: "INC-SIM-003", 
    timestamp: "2026-07-04 10:20", 
    prediction: "CRITICO", 
    metrics: { intentos_login_fallidos: 195, puertos_abiertos: 85, vulnerabilidades_criticas: 18, trafico_anomalo_pct: 95, equipos_afectados: 450, parcheado_pct: 12 } 
  }
];

export default function CyberSentinelDashboard() {
  // Inicializa por defecto con el caso crítico simulado para tu reto especial
  const [currentIncident, setCurrentIncident] = useState(mockIncidents[2]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función principal para enviar métricas al endpoint POST /predict del backend
  const procesarPrediccionReal = async (incidentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toBackendMetrics(incidentData.metrics)) // Traduce snake_case -> camelCase real del backend
      });

      if (!response.ok) {
        throw new Error('Error al procesar la predicción en el servidor de Spring Boot.');
      }

      const resData = await response.json();
      
      // Mapeamos la respuesta del backend para que encaje perfectamente con la UI
      setCurrentIncident({
        id: `INC-REAL-${resData.timestamp ? String(resData.timestamp).slice(-4) : '001'}`,
        timestamp: resData.timestamp ? new Date(resData.timestamp).toLocaleString() : new Date().toLocaleString(),
        prediction: resData.prediction || resData.severity, // Soporta ambos campos mapeados por tu backend
        metrics: incidentData.metrics,
        confidence: resData.confidence, // Confianza real del modelo (0.0 - 1.0)
        recommendations: resData.recommendations // Recomendaciones reales generadas por MLPredictionService
      });

      // Si todo sale bien, refrescamos el historial desde el backend
      cargarHistorialReal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la lista histórica desde GET /incidents del backend
  const cargarHistorialReal = async () => {
    try {
      const response = await fetch(`${BASE_URL}/incidents`);
      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
      }
    } catch (err) {
      console.error("Error al cargar la bitácora del backend:", err);
    }
  };

  // Carga inicial del historial si la integración real está activa
  useEffect(() => {
    if (USAR_BACKEND_REAL) {
      procesarPrediccionReal(mockIncidents[2]); // Carga inicial enviando el caso crítico real
    } else {
      setHistorico(mockIncidents); // En modo simulación usa el arreglo local
    }
  }, []);

  const handleSeleccionCaso = (inc) => {
    if (USAR_BACKEND_REAL) {
      procesarPrediccionReal(inc); // Hace la llamada real por POST
    } else {
      setCurrentIncident(inc); // Cambia de forma local instantánea
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'BAJO': return { backgroundColor: '#22c55e', color: '#fff' };
      case 'MEDIO': return { backgroundColor: '#eab308', color: '#000' };
      case 'ALTO': return { backgroundColor: '#f97316', color: '#fff' };
      case 'CRITICO': return { backgroundColor: '#dc2626', color: '#fff' };
      default: return { backgroundColor: '#6b7280', color: '#fff' };
    }
  };

  if (loading) return <div style={{ backgroundColor: '#111827', color: '#3b82f6', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>⚙️ Consultando al Modelo Predictivo en Spring Boot (`POST /predict`)...</div>;
  if (error) return <div style={{ backgroundColor: '#111827', color: '#ef4444', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>⚠️ Error de Integración: {error} <br/><small style={{color: '#9ca3af'}}>Verifica que la API base `http://localhost:8080/api/cyber-sentinel` esté en ejecución.</small></div>;

  return (
    <div style={{ backgroundColor: '#111827', color: '#f3f4f6', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* Header y Control de Simulación */}
      <header style={{ borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>CyberSentinel</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0' }}>Priorizador de Incidentes de Ciberseguridad</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#1f2937', padding: '8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{USAR_BACKEND_REAL ? "Probar Endpoint Backend:" : "Simular Caso Local:"}</span>
          {mockIncidents.map(inc => (
            <button 
              key={inc.id} 
              onClick={() => handleSeleccionCaso(inc)} 
              style={{ 
                padding: '4px 8px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                border: 'none', 
                backgroundColor: currentIncident?.prediction === inc.prediction ? '#2563eb' : '#4b5563', 
                color: '#fff'
              }}
            >
              {inc.prediction}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Distribución Central */}
      {currentIncident && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Fila de Estado Superior */}
            <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{currentIncident.id}</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Detectado: {currentIncident.timestamp}</p>
              </div>
              <span style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', ...getSeverityStyle(currentIncident.prediction) }}>
                {currentIncident.prediction}
              </span>
            </div>

            {/* Datos reales del modelo backend (solo aparecen si vienen del API real) */}
            {(currentIncident.confidence != null || currentIncident.recommendations) && (
              <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  Respuesta del Modelo (Backend)
                </h4>
                {currentIncident.confidence != null && (
                  <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#d1d5db' }}>
                    Confianza de la predicción: <strong style={{ color: '#fff' }}>{Math.round(currentIncident.confidence * 100)}%</strong>
                  </p>
                )}
                {currentIncident.recommendations && (
                  <p style={{ fontSize: '14px', margin: 0, color: '#d1d5db', lineHeight: '1.5' }}>
                    {currentIncident.recommendations}
                  </p>
                )}
              </div>
            )}
            
            {/* Bloques de Métricas y Recomendaciones Alineados */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <MetricsGrid metrics={currentIncident.metrics} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RecommendationsPanel incident={currentIncident} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bitácora Histórica de Incidentes */}
      <section style={{ marginTop: '32px', backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#fff' }}>Bitácora Histórica de Incidentes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #374151', color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID Incidente</th>
                <th style={{ padding: '12px' }}>Fecha / Hora</th>
                <th style={{ padding: '12px' }}>Severidad</th>
                <th style={{ padding: '12px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((inc, index) => {
                const severidad = inc.prediction || inc.severity;
                const idMostrar = inc.id && typeof inc.id === 'number' ? `INC-DB-00${inc.id}` : inc.id;
                const fechaMostrar = inc.createdAt ? new Date(inc.createdAt).toLocaleString() : inc.timestamp;

                return (
                  <tr key={inc.id || index} style={{ borderBottom: '1px solid #374151' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#60a5fa' }}>{idMostrar}</td>
                    <td style={{ padding: '12px', color: '#d1d5db' }}>{fechaMostrar}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', ...getSeverityStyle(severidad) }}>
                        {severidad}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => {
                          if (USAR_BACKEND_REAL) {
                            // Reconstruye el objeto para inspección si viene del API real
                            setCurrentIncident({
                              id: idMostrar,
                              timestamp: fechaMostrar,
                              prediction: severidad,
                              metrics: toFrontendMetrics(inc),
                              confidence: inc.confidence,
                              recommendations: inc.recommendations
                            });
                          } else {
                            setCurrentIncident(inc);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}
                      >
                        Inspeccionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}