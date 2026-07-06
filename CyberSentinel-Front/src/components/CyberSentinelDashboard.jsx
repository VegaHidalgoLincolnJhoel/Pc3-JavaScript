import React, { useState, useEffect } from 'react';
import MetricsGrid from './MetricsGrid';
import RecommendationsPanel from './RecommendationsPanel';

// CONFIGURACIÓN: Cambia a true cuando quieras conectarte con el backend real de tu grupo
const USAR_BACKEND_REAL = true; // true = React -> Spring Boot -> Python; false = solo simulación local con mocks
const BASE_URL = import.meta.env.VITE_SPRINGBOOT_URL || "http://localhost:8080/api/cyber-sentinel";

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
  // Inicializa por defecto con el caso crítico simulado
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
        body: JSON.stringify(incidentData.metrics) // Envía las métricas en snake_case
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        const detalle = resData?.detail || resData?.error || 'Error al procesar la predicción.';
        throw new Error(typeof detalle === 'string' ? detalle : JSON.stringify(detalle));
      }

      // CORRECCIÓN DE MAPEO: Sincronizado con las variables en inglés de la documentación del Backend
      const nuevoIncidente = {
        id: `INC-REAL-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString(),
        prediction: resData.prediction || resData.severity, // Lee 'prediction' o 'severity' del back
        metrics: incidentData.metrics,
        confidence: resData.confidence, // Lee 'confidence' en inglés
        recommendations: Array.isArray(resData.recommendations)
          ? resData.recommendations.join(' ')
          : resData.recommendations,
        ranking: resData.ranking || []
      };

      setCurrentIncident(nuevoIncidente);

      // Agrega el nuevo reporte al tope de la bitácora local de la sesión
      setHistorico(prev => [nuevoIncidente, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial: en modo simulado usamos los mocks; en modo real iniciamos vacío
  useEffect(() => {
    if (!USAR_BACKEND_REAL) {
      setHistorico(mockIncidents);
    }
  }, []);

  const handleSeleccionCaso = (inc) => {
    if (USAR_BACKEND_REAL) {
      procesarPrediccionReal(inc); // Ejecuta el flujo real completo
    } else {
      setCurrentIncident(inc); // Cambia instantáneamente de modo local
    }
  };

  const getSeverityStyle = (severity) => {
    if (!severity) return { backgroundColor: '#6b7280', color: '#fff' };
    
    // Limpiamos el string para la evaluación de colores
    const cleanSeverity = severity.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    switch (cleanSeverity) {
      case 'BAJO':
      case 'LOW': 
        return { backgroundColor: '#22c55e', color: '#fff' }; // Verde
      case 'MEDIO':
      case 'MEDIUM': 
        return { backgroundColor: '#eab308', color: '#000' }; // Amarillo
      case 'ALTO':
      case 'HIGH': 
        return { backgroundColor: '#f97316', color: '#fff' }; // Naranja
      case 'CRITICO':
      case 'CRITICAL': 
        return { backgroundColor: '#dc2626', color: '#fff' }; // Rojo
      default: 
        // Si no entra en ninguno, dejamos el fondo gris oscuro pero añadimos un borde rojo de advertencia
        return { backgroundColor: '#374151', color: '#ef4444', border: '1px solid #ef4444' }; 
    }
  };
  
  const sonSeveridadesIguales = (sev1, sev2) => {
    if (!sev1 || !sev2) return false;
    
    // Función interna para limpiar cualquier texto (quita tildes, espacios y pasa a mayúsculas)
    const norm = (str) => {
      if (typeof str !== 'string') return String(str);
      return str.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const s1 = norm(sev1);
    const s2 = norm(sev2);

    // Mapeo rápido por si el backend responde en inglés
    const mapeoIngles = { 'LOW': 'BAJO', 'MEDIUM': 'MEDIO', 'HIGH': 'ALTO', 'CRITICAL': 'CRITICO' };
    const finalS1 = mapeoIngles[s1] || s1;
    const finalS2 = mapeoIngles[s2] || s2;

    return finalS1 === finalS2;
  };

  if (loading) return <div style={{ backgroundColor: '#111827', color: '#3b82f6', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>⚙️ Consultando al Modelo Predictivo (Spring Boot → Python `POST /predict`)...</div>;
  if (error) return <div style={{ backgroundColor: '#111827', color: '#ef4444', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>⚠️ Error de Integración: {error} <br/><small style={{color: '#9ca3af'}}>Verifica que Spring Boot (:8080) y la IA de Python (:8001) estén activos.</small></div>;

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
                backgroundColor: sonSeveridadesIguales(currentIncident?.prediction, inc.prediction) ? '#2563eb' : '#4b5563', 
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

            {/* Datos Analíticos de Python */}
            {(currentIncident.confidence != null || currentIncident.recommendations || (Array.isArray(currentIncident.ranking) && currentIncident.ranking.length > 0)) && (
              <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#60a5fa', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  Respuesta Analítica del Core IA
                </h4>
                {currentIncident.confidence != null && (
                  <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#d1d5db' }}>
                    Confianza de Evaluación: <strong style={{ color: '#fff' }}>{Math.round(currentIncident.confidence * 100)}%</strong>
                  </p>
                )}
                {currentIncident.recommendations && (
                  <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#e5e7eb', lineHeight: '1.5' }}>
                    <strong>Análisis:</strong> {currentIncident.recommendations}
                  </p>
                )}
                {Array.isArray(currentIncident.ranking) && currentIncident.ranking.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <h5 style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                      Distribución de Probabilidades
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#9ca3af' }}>
                      {currentIncident.ranking.map((r, idx) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>
                          <span style={{ color: '#d1d5db', fontWeight: '500' }}>{r.clase}:</span> {Math.round(r.probabilidad * 100)}%
                        </li>
                      ))}
                    </ul>
                  </div>
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

      {/* Bitácora Histórica */}
      <section style={{ marginTop: '32px', backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#fff' }}>Bitácora Histórica de Incidentes</h3>
        {historico.length === 0 && (
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Aún no hay incidentes evaluados en esta sesión. Selecciona un caso para disparar la petición REST.
          </p>
        )}
        {historico.length > 0 && (
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
                {historico.map((inc, index) => (
                  <tr key={inc.id || index} style={{ borderBottom: '1px solid #374151' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#60a5fa' }}>{inc.id}</td>
                    <td style={{ padding: '12px', color: '#d1d5db' }}>{inc.timestamp}</td>
                    <td style={{ padding: '12px' }}>
                      {/* CORRECCIÓN: Pinta la celda de severidad usando el string limpio */}
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', ...getSeverityStyle(inc.prediction) }}>
                        {inc.prediction}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => setCurrentIncident(inc)}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}
                      >
                        Inspeccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}