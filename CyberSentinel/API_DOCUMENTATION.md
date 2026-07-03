# CyberSentinel API Documentation

## Overview

CyberSentinel es un sistema de priorización de incidentes de ciberseguridad que utiliza un algoritmo de machine learning para predecir la severidad de los incidentes basándose en métricas de seguridad.

## Base URL

```
http://localhost:8080/api/cyber-sentinel
```

## Endpoints

### 1. **Predecir Severidad de Incidente** (Principal)

#### Endpoint
```
POST /api/cyber-sentinel/predict
```

#### Descripción
Analiza las métricas de un incidente de seguridad y predice su nivel de severidad.

#### Parámetros (Request Body)
```json
{
  "intentos_login_fallidos": 80,
  "puertos_abiertos": 40,
  "vulnerabilidades_criticas": 8,
  "trafico_anomalo_pct": 45,
  "equipos_afectados": 200,
  "parcheado_pct": 60
}
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| intentos_login_fallidos | Integer | 0-200 | Cantidad de intentos fallidos de acceso |
| puertos_abiertos | Integer | 0-100 | Cantidad de puertos expuestos detectados |
| vulnerabilidades_criticas | Integer | 0-20 | Cantidad de vulnerabilidades críticas identificadas |
| trafico_anomalo_pct | Integer | 0-100 | Porcentaje de tráfico anómalo detectado |
| equipos_afectados | Integer | 0-500 | Cantidad de equipos afectados por el incidente |
| parcheado_pct | Integer | 0-100 | Porcentaje de equipos parcheados/actualizados |

#### Response
```json
{
  "severity": "MEDIO",
  "prediction": "MEDIO",
  "confidence": 0.68,
  "recommendations": "Review and escalate if needed. Prioritize critical vulnerability patches. Increase patching efforts. ",
  "timestamp": 1625000000000
}
```

#### Niveles de Severidad
- **BAJO**: Riesgo bajo, monitorear la situación
- **MEDIO**: Riesgo moderado, revisar y considerar escalar
- **ALTO**: Riesgo alto, escalar inmediatamente
- **CRITICO**: Riesgo crítico, activar plan de respuesta a incidentes

#### Ejemplo cURL

```bash
curl -X POST http://localhost:8080/api/cyber-sentinel/predict \
  -H "Content-Type: application/json" \
  -d '{
    "intentos_login_fallidos": 80,
    "puertos_abiertos": 40,
    "vulnerabilidades_criticas": 8,
    "trafico_anomalo_pct": 45,
    "equipos_afectados": 200,
    "parcheado_pct": 60
  }'
```

---

### 2. **Obtener Todos los Incidentes**

#### Endpoint
```
GET /api/cyber-sentinel/incidents
```

#### Descripción
Recupera el histórico completo de todos los incidentes analizados.

#### Response
```json
[
  {
    "id": 1,
    "intentos_login_fallidos": 80,
    "puertos_abiertos": 40,
    "vulnerabilidades_criticas": 8,
    "trafico_anomalo_pct": 45,
    "equipos_afectados": 200,
    "parcheado_pct": 60,
    "severity": "MEDIO",
    "confidence": 0.68,
    "recommendations": "Review and escalate if needed...",
    "createdAt": "2025-07-03T12:00:00",
    "updatedAt": "2025-07-03T12:00:00"
  },
  ...
]
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/incidents
```

---

### 3. **Obtener Incidente por ID**

#### Endpoint
```
GET /api/cyber-sentinel/incidents/{id}
```

#### Descripción
Recupera los detalles de un incidente específico.

#### Parámetros
- `id`: ID del incidente (Path Parameter)

#### Response
```json
{
  "id": 1,
  "intentos_login_fallidos": 80,
  "puertos_abiertos": 40,
  "vulnerabilidades_criticas": 8,
  "trafico_anomalo_pct": 45,
  "equipos_afectados": 200,
  "parcheado_pct": 60,
  "severity": "MEDIO",
  "confidence": 0.68,
  "recommendations": "Review and escalate if needed...",
  "createdAt": "2025-07-03T12:00:00",
  "updatedAt": "2025-07-03T12:00:00"
}
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/incidents/1
```

---

### 4. **Filtrar Incidentes por Severidad**

#### Endpoint
```
GET /api/cyber-sentinel/incidents/severity/{severity}
```

#### Descripción
Recupera todos los incidentes de un nivel de severidad específico.

#### Parámetros
- `severity`: Nivel de severidad (BAJO, MEDIO, ALTO, CRITICO) (Path Parameter)

#### Response
```json
[
  {
    "id": 1,
    "severity": "MEDIO",
    ...
  },
  ...
]
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/incidents/severity/CRITICO
```

---

### 5. **Obtener Incidentes Críticos**

#### Endpoint
```
GET /api/cyber-sentinel/critical-incidents
```

#### Descripción
Recupera incidentes críticos con alta confianza de predicción (>80%).

#### Response
```json
[
  {
    "id": 5,
    "severity": "CRITICO",
    "confidence": 0.92,
    ...
  },
  ...
]
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/critical-incidents
```

---

### 6. **Obtener Estadísticas**

#### Endpoint
```
GET /api/cyber-sentinel/statistics
```

#### Descripción
Obtiene estadísticas resumidas de incidentes por nivel de severidad.

#### Response
```json
{
  "total": 50,
  "critico": 5,
  "alto": 12,
  "medio": 18,
  "bajo": 15
}
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/statistics
```

---

### 7. **Health Check**

#### Endpoint
```
GET /api/cyber-sentinel/health
```

#### Descripción
Verifica el estado del servicio.

#### Response
```json
{
  "status": "UP",
  "service": "CyberSentinel - Incident Prioritization Service",
  "version": "1.0.0"
}
```

#### Ejemplo cURL

```bash
curl http://localhost:8080/api/cyber-sentinel/health
```

---

## Ejemplos de Uso Práctico

### Ejemplo 1: Incidente de Baja Severidad
```bash
curl -X POST http://localhost:8080/api/cyber-sentinel/predict \
  -H "Content-Type: application/json" \
  -d '{
    "intentos_login_fallidos": 10,
    "puertos_abiertos": 5,
    "vulnerabilidades_criticas": 2,
    "trafico_anomalo_pct": 10,
    "equipos_afectados": 50,
    "parcheado_pct": 95
  }'
```

**Response**: `BAJO` - Solo monitorear

### Ejemplo 2: Incidente de Severidad Crítica
```bash
curl -X POST http://localhost:8080/api/cyber-sentinel/predict \
  -H "Content-Type: application/json" \
  -d '{
    "intentos_login_fallidos": 180,
    "puertos_abiertos": 85,
    "vulnerabilidades_criticas": 18,
    "trafico_anomalo_pct": 90,
    "equipos_afectados": 450,
    "parcheado_pct": 20
  }'
```

**Response**: `CRITICO` - Activar plan de respuesta a incidentes

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Solicitud exitosa |
| 400 | Datos de entrada inválidos o fuera de rango |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Algoritmo de Predicción

El algoritmo utiliza un modelo de scoring ponderado basado en los siguientes criterios:

| Métrica | Peso | Importancia |
|---------|------|-------------|
| Vulnerabilidades críticas | 25% | Mayor prioridad |
| Intentos login fallidos | 15% | Posible ataque de fuerza bruta |
| Puertos abiertos | 15% | Superficie de ataque |
| Tráfico anómalo | 15% | Actividad sospechosa |
| Equipos afectados | 15% | Impacto en la infraestructura |
| Equipos sin parches | 15% | Riesgo de explotación |

### Escalas de Riesgo

- **BAJO**: Score < 0.25
- **MEDIO**: 0.25 ≤ Score < 0.50
- **ALTO**: 0.50 ≤ Score < 0.75
- **CRITICO**: Score ≥ 0.75

---

## Recomendaciones Automáticas

El sistema genera automáticamente recomendaciones basadas en la severidad detectada:

**BAJO**: Monitorear la situación

**MEDIO**: 
- Revisar y considerar escalación
- Priorizar parches de vulnerabilidades críticas
- Aumentar esfuerzos de parcheado

**ALTO**:
- Escalar inmediatamente al equipo de seguridad
- Investigar sistemas afectados
- Monitorear patrones de tráfico
- Considerar aislar equipos afectados

**CRITICO**:
- Activar plan de respuesta a incidentes
- Aislar sistemas afectados
- Involucrar equipo de respuesta a incidentes
- Preparar medidas de contención
- Documentar todas las acciones

---

## Configuración

### application.properties

```properties
# Base de datos (H2 en memoria)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update

# Puerto del servidor
server.port=8080

# Logging
logging.level.com.Pc3.CyberSentinel=DEBUG
```

---

## Construir y Ejecutar

### Compilar
```bash
./mvnw clean compile
```

### Empaquetar
```bash
./mvnw clean package -DskipTests
```

### Ejecutar JAR
```bash
java -jar target/CyberSentinel-0.0.1-SNAPSHOT.jar
```

### Ejecutar con Maven
```bash
./mvnw spring-boot:run
```

---

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/Pc3/CyberSentinel/
│   │   ├── CyberSentinelApplication.java
│   │   ├── controller/
│   │   │   └── IncidentController.java
│   │   ├── service/
│   │   │   ├── IncidentService.java
│   │   │   └── MLPredictionService.java
│   │   ├── model/
│   │   │   ├── Incident.java
│   │   │   └── SeverityLevel.java
│   │   ├── dto/
│   │   │   ├── IncidentDataDTO.java
│   │   │   └── PredictionResponseDTO.java
│   │   ├── repository/
│   │   │   └── IncidentRepository.java
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/com/Pc3/CyberSentinel/
        └── CyberSentinelApplicationTests.java
```

---

## Conexión con React Frontend

Para integrar con el frontend React, asegúrate de:

1. Habilitar CORS (ya está configurado con `@CrossOrigin(origins = "*")`)
2. Llamar a `POST /api/cyber-sentinel/predict` con los datos del formulario
3. Mostrar la severidad con código de color (BAJO=verde, MEDIO=amarillo, ALTO=naranja, CRITICO=rojo)
4. Mostrar recomendaciones al usuario
5. Usar `/api/cyber-sentinel/statistics` para el dashboard

---

## Notas

- Todos los datos se almacenan en una base de datos H2 en memoria
- Los timestamps se registran automáticamente
- El modelo es determinístico y reproducible
- La confianza de predicción varía de 0.0 a 1.0

---

**Versión**: 1.0.0  
**Última actualización**: 2025-07-03
