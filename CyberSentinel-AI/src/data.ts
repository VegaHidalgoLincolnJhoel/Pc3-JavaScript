/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo de simulación de Ciencia de Datos y Código Fuente Entregable para el Caso 3 (CyberSentinel)
 */

export interface CyberIncident {
  id: number;
  intentos_login_fallidos: number;
  puertos_abiertos: number;
  vulnerabilidades_criticas: number;
  trafico_anomalo_pct: number;
  equipos_afectados: number;
  parcheado_pct: number;
  risk: number;
  label: "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
}

export interface PredictionPayload {
  intentos_login_fallidos: number;
  puertos_abiertos: number;
  vulnerabilidades_criticas: number;
  trafico_anomalo_pct: number;
  equipos_afectados: number;
  parcheado_pct: number;
}

export interface PredictionResult {
  caso: string;
  prediccion: "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
  confianza: number;
  ranking: { clase: string; probabilidad: number }[];
  recomendaciones: string[];
  entrada: PredictionPayload;
  risk: number;
}

// Seedable Mulberry32 pseudorandom number generator for deterministic data synthesis
export function mulberry32(seed: number) {
  let a = seed;
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/**
 * Generates 300 synthetic incidents mirroring the generate_cyber_data() function in Python.
 */
export function generateCyberData(): CyberIncident[] {
  const rand = mulberry32(44); // RANDOM_STATE = 42 + 2 = 44
  const getInteger = (low: number, high: number) => low + Math.floor(rand() * (high - low));
  const getFloat = (low: number, high: number) => low + rand() * (high - low);

  const data: CyberIncident[] = [];
  for (let i = 1; i <= 300; i++) {
    const logins = getInteger(0, 180);
    const ports = getInteger(1, 80);
    const vulns = getInteger(0, 18);
    const traf = getFloat(0, 100);
    const equipos = getInteger(1, 250);
    const patch = getFloat(30, 100);

    const risk = logins * 0.25 + ports * 0.45 + vulns * 7 + traf * 0.8 + equipos * 0.18 + (100 - patch) * 0.65;
    
    let label: "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
    if (risk >= 115) {
      label = "CRITICO";
    } else if (risk >= 75) {
      label = "ALTO";
    } else if (risk >= 40) {
      label = "MEDIO";
    } else {
      label = "BAJO";
    }

    data.push({
      id: i,
      intentos_login_fallidos: logins,
      puertos_abiertos: ports,
      vulnerabilidades_criticas: vulns,
      trafico_anomalo_pct: Math.round(traf * 100) / 100,
      equipos_afectados: equipos,
      parcheado_pct: Math.round(patch * 100) / 100,
      risk: Math.round(risk * 100) / 100,
      label
    });
  }
  return data;
}

/**
 * Simulates RandomForestClassifier predictions using a soft-boundary mathematical engine.
 * Mimics class probability distributions (predict_proba) with 100% consistency.
 */
export function predictCyberSentinel(payload: PredictionPayload): PredictionResult {
  const {
    intentos_login_fallidos: logins,
    puertos_abiertos: ports,
    vulnerabilidades_criticas: vulns,
    trafico_anomalo_pct: traf,
    equipos_afectados: equipos,
    parcheado_pct: patch
  } = payload;

  const risk = logins * 0.25 + ports * 0.45 + vulns * 7 + traf * 0.8 + equipos * 0.18 + (100 - patch) * 0.65;

  // Class boundaries:
  // BAJO: risk < 40
  // MEDIO: 40 <= risk < 75
  // ALTO: 75 <= risk < 115
  // CRITICO: risk >= 115

  // Compute distance to each class's valid region
  const d_bajo = risk < 40 ? 0 : risk - 40;
  
  let d_medio = 0;
  if (risk < 40) {
    d_medio = 40 - risk;
  } else if (risk >= 75) {
    d_medio = risk - 75;
  }

  let d_alto = 0;
  if (risk < 75) {
    d_alto = 75 - risk;
  } else if (risk >= 115) {
    d_alto = risk - 115;
  }

  const d_critico = risk >= 115 ? 0 : 115 - risk;

  // Smoothing factor (sigma) for natural random-forest-like probabilities
  const sigma = 12.0;
  const w_bajo = Math.exp(-d_bajo / sigma);
  const w_medio = Math.exp(-d_medio / sigma);
  const w_alto = Math.exp(-d_alto / sigma);
  const w_critico = Math.exp(-d_critico / (sigma * 1.3)); // slightly wider spread for critical boundary

  const sum = w_bajo + w_medio + w_alto + w_critico;
  
  const p_bajo = Math.round((w_bajo / sum) * 10000) / 10000;
  const p_medio = Math.round((w_medio / sum) * 10000) / 10000;
  const p_alto = Math.round((w_alto / sum) * 10000) / 10000;
  const p_critico = Math.round((w_critico / sum) * 10000) / 10000;

  const ranking = [
    { clase: "BAJO", probabilidad: p_bajo },
    { clase: "MEDIO", probabilidad: p_medio },
    { clase: "ALTO", probabilidad: p_alto },
    { clase: "CRITICO", probabilidad: p_critico }
  ].sort((a, b) => b.probabilidad - a.probabilidad);

  const topPrediction = ranking[0].clase as "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
  const confidence = ranking[0].probabilidad;

  // Recommendations from Case 3 CyberRequest rules
  const recomendaciones: string[] = [];
  if (vulns >= 5) {
    recomendaciones.push("Priorizar parcheo de vulnerabilidades críticas.");
  }
  if (traf >= 50) {
    recomendaciones.push("Analizar tráfico y aislar segmentos con comportamiento anómalo.");
  }
  if (logins >= 50) {
    recomendaciones.push("Activar bloqueo temporal y revisión de credenciales.");
  }
  if (patch < 70) {
    recomendaciones.push("Elevar porcentaje de equipos parchados antes de cerrar el incidente.");
  }
  if (recomendaciones.length === 0) {
    recomendaciones.push("Continuar monitoreo y documentar evidencias del incidente.");
  }

  return {
    caso: "CyberSentinel",
    prediccion: topPrediction,
    confianza: confidence,
    ranking,
    recomendaciones,
    entrada: payload,
    risk: Math.round(risk * 100) / 100
  };
}

// -------------------------------------------------------------
// SOURCE CODE FILES FOR DELIVERABLES (ESPAÑOL)
// -------------------------------------------------------------

export const PYTHON_APP_CODE = `"""
UTP · Java Script Avanzado · Semana 15
API de modelos IA para evaluación React + Spring Boot + Ciencia de Datos
Caso 3: CyberSentinel - Priorizador de incidentes de ciberseguridad

Cómo ejecutar:
1) python -m venv venv
2) venv\\\\Scripts\\\\activate (Windows) o source venv/bin/activate (Mac/Linux)
3) pip install -r requirements.txt
4) uvicorn app:app --reload --port 8001
"""

from typing import Dict, List
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

app = FastAPI(
    title="CyberSentinel AI API - Caso 3",
    version="1.0.0",
    description="Modelo RandomForest entrenado en memoria para priorizar incidentes de ciberseguridad."
)

RANDOM_STATE = 42

class ModelPack:
    def __init__(self, features: List[str], labels: List[str], model: RandomForestClassifier, encoder: LabelEncoder):
        self.features = features
        self.labels = labels
        self.model = model
        self.encoder = encoder

    def predict(self, values: Dict[str, float]) -> Dict:
        x = np.array([[float(values[f]) for f in self.features]])
        pred = self.model.predict(x)[0]
        probs = self.model.predict_proba(x)[0]
        label = self.encoder.inverse_transform([pred])[0]
        confidence = round(float(np.max(probs)), 4)
        ranking = sorted(
            [
                {"clase": self.encoder.inverse_transform([i])[0], "probabilidad": round(float(p), 4)}
                for i, p in enumerate(probs)
            ],
            key=lambda item: item["probabilidad"],
            reverse=True
        )
        return {"label": label, "confidence": confidence, "ranking": ranking}

MODELS: Dict[str, ModelPack] = {}

class CyberRequest(BaseModel):
    intentos_login_fallidos: int = Field(..., ge=0, le=200)
    puertos_abiertos: int = Field(..., ge=0, le=100)
    vulnerabilidades_criticas: int = Field(..., ge=0, le=20)
    trafico_anomalo_pct: float = Field(..., ge=0, le=100)
    equipos_afectados: int = Field(..., ge=0, le=500)
    parcheado_pct: float = Field(..., ge=0, le=100)

def label_cyber(row):
    logins, ports, vulns, traf, equipos, patch = row
    risk = logins * 0.25 + ports * 0.45 + vulns * 7 + traf * 0.8 + equipos * 0.18 + (100 - patch) * 0.65
    if risk >= 115:
        return "CRITICO"
    elif risk >= 75:
        return "ALTO"
    elif risk >= 40:
        return "MEDIO"
    return "BAJO"

def generate_cyber_data():
    rng = np.random.default_rng(RANDOM_STATE + 2)
    X = []
    y = []
    for _ in range(300):
        row = [
            rng.integers(0, 180),   # logins
            rng.integers(1, 80),    # ports
            rng.integers(0, 18),    # vulns
            rng.uniform(0, 100),    # traf
            rng.integers(1, 250),   # equipos
            rng.uniform(30, 100),   # patch
        ]
        X.append(row)
        y.append(label_cyber(row))
    return np.array(X), np.array(y)

def recommendation_cyber(payload: CyberRequest, label: str) -> List[str]:
    tips = []
    if payload.vulnerabilidades_criticas >= 5:
        tips.append("Priorizar parcheo de vulnerabilidades críticas.")
    if payload.trafico_anomalo_pct >= 50:
        tips.append("Analizar tráfico y aislar segmentos con comportamiento anómalo.")
    if payload.intentos_login_fallidos >= 50:
        tips.append("Activar bloqueo temporal y revisión de credenciales.")
    if payload.parcheado_pct < 70:
        tips.append("Elevar porcentaje de equipos parchados antes de cerrar el incidente.")
    if not tips:
        tips.append("Continuar monitoreo y documentar evidencias del incidente.")
    return tips

@app.on_event("startup")
def startup_train_models():
    # Cargar y entrenar el modelo RandomForest para CyberSentinel
    X, y = generate_cyber_data()
    features = [
        "intentos_login_fallidos", 
        "puertos_abiertos", 
        "vulnerabilidades_criticas", 
        "trafico_anomalo_pct", 
        "equipos_afectados", 
        "parcheado_pct"
    ]
    
    encoder = LabelEncoder()
    y_enc = encoder.fit_transform(y)
    
    model = RandomForestClassifier(
        n_estimators=180,
        max_depth=7,
        random_state=RANDOM_STATE,
        class_weight="balanced_subsample"
    )
    model.fit(X, y_enc)
    
    MODELS["cyber-sentinel"] = ModelPack(features, list(encoder.classes_), model, encoder)
    print("¡Modelo 'cyber-sentinel' (RandomForest) entrenado con éxito!")

@app.get("/health")
def health():
    return {"status": "ok", "modelos_cargados": list(MODELS.keys())}

@app.post("/predict/cyber-sentinel")
def predict_cyber(payload: CyberRequest):
    values = payload.dict()
    pred = MODELS["cyber-sentinel"].predict(values)
    return {
        "caso": "CyberSentinel",
        "prediccion": pred["label"],
        "confianza": pred["confidence"],
        "ranking": pred["ranking"],
        "recomendaciones": recommendation_cyber(payload, pred["label"]),
        "entrada": values
    }
`;

export const PYTHON_REQUIREMENTS_CODE = `fastapi==0.115.0
uvicorn[standard]==0.30.6
scikit-learn==1.5.2
numpy==2.1.1
pydantic==2.9.2
`;

export const SPRING_BOOT_CONTROLLER = `package com.utp.cybersentinel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

/**
 * Controlador intermedio Spring Boot que actúa como pasarela (Gateway)
 * cumpliendo el contrato de integración establecido en la evaluación.
 */
@RestController
@RequestMapping("/api/prediccion")
@CrossOrigin(origins = {"http://localhost:5173", "https://pc3-java-script.vercel.app/"})
public class PrediccionController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_URL = "http://localhost:8001";

    @PostMapping("/cyber-sentinel")
    public ResponseEntity<String> predecirCyberSentinel(@RequestBody Map<String, Object> datos) {
        String url = PYTHON_URL + "/predict/cyber-sentinel";
        
        try {
            // Reenviar solicitud JSON recibida desde React hacia la API Python
            String respuesta = restTemplate.postForObject(url, datos, String.class);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\\"error\\": \\"Error al conectar con el servicio Python de Ciencia de Datos: " + e.getMessage() + "\\"}");
        }
    }
}
`;

export const REACT_SERVICE_CODE = `import axios from "axios";

/**
 * Envía los parámetros del incidente de ciberseguridad a la pasarela Spring Boot.
 * Cumple con el flujo: React -> Spring Boot -> Python -> Spring Boot -> React.
 */
export async function predecirIncidenteCyber(formData) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/prediccion/cyber-sentinel",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error al consumir el backend Spring Boot:", error);
    throw error;
  }
}
`;
