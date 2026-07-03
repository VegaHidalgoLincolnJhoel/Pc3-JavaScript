# CyberSentinel - Guía Rápida de Inicio

## ¿Qué es CyberSentinel?

CyberSentinel es una aplicación Spring Boot 4.1.0 que implementa un sistema de priorización inteligente de incidentes de ciberseguridad. Utiliza métricas de seguridad para predecir automáticamente la severidad de los incidentes (BAJO, MEDIO, ALTO, CRITICO).

---

## Inicio Rápido

### 1. Compilar el Proyecto
```bash
cd /home/lincoln/Documentos/Pc3-JavaScript/CyberSentinel:/
./mvnw clean compile
```

### 2. Empaquetar la Aplicación
```bash
./mvnw clean package -DskipTests
```

### 3. Ejecutar la Aplicación
```bash
java -jar target/CyberSentinel-0.0.1-SNAPSHOT.jar
```

O directamente con Maven:
```bash
./mvnw spring-boot:run
```

La aplicación estará disponible en: **http://localhost:8080**

---

## API Endpoints Principales

### 🔮 Predecir Severidad de Incidente (Endpoint Principal)
```
POST /api/cyber-sentinel/predict
```

**Ejemplo de solicitud:**
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

**Respuesta:**
```json
{
  "severity": "MEDIO",
  "prediction": "MEDIO",
  "confidence": 0.68,
  "recommendations": "Review and escalate if needed. Prioritize critical vulnerability patches. Increase patching efforts.",
  "timestamp": 1625000000000
}
```

---

### 📊 Otros Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cyber-sentinel/incidents` | Obtener todos los incidentes |
| GET | `/api/cyber-sentinel/incidents/{id}` | Obtener incidente por ID |
| GET | `/api/cyber-sentinel/incidents/severity/{severity}` | Filtrar por severidad |
| GET | `/api/cyber-sentinel/critical-incidents` | Obtener incidentes críticos |
| GET | `/api/cyber-sentinel/statistics` | Ver estadísticas |
| GET | `/api/cyber-sentinel/health` | Verificar estado del servicio |

---

## Parámetros de Entrada

Todos los valores deben estar dentro de los siguientes rangos:

| Parámetro | Rango | Significado |
|-----------|-------|-------------|
| intentos_login_fallidos | 0-200 | Intentos fallidos de autenticación |
| puertos_abiertos | 0-100 | Puertos expuestos detectados |
| vulnerabilidades_criticas | 0-20 | Vulnerabilidades críticas identificadas |
| trafico_anomalo_pct | 0-100 | Porcentaje de tráfico anómalo |
| equipos_afectados | 0-500 | Cantidad de equipos comprometidos |
| parcheado_pct | 0-100 | Porcentaje de sistemas parcheados |

---

## Niveles de Severidad

| Nivel | Color | Acción Recomendada |
|-------|-------|-------------------|
| **BAJO** | 🟢 Verde | Monitorear |
| **MEDIO** | 🟡 Amarillo | Revisar y considerar escalación |
| **ALTO** | 🟠 Naranja | Escalar inmediatamente |
| **CRITICO** | 🔴 Rojo | Activar plan de respuesta a incidentes |

---

## Ejemplo Completo de Flujo

### 1. Verificar el servicio está activo
```bash
curl http://localhost:8080/api/cyber-sentinel/health
```

### 2. Reportar un nuevo incidente
```bash
curl -X POST http://localhost:8080/api/cyber-sentinel/predict \
  -H "Content-Type: application/json" \
  -d '{
    "intentos_login_fallidos": 150,
    "puertos_abiertos": 70,
    "vulnerabilidades_criticas": 15,
    "trafico_anomalo_pct": 75,
    "equipos_afectados": 350,
    "parcheado_pct": 40
  }'
```

**Resultado esperado**: `ALTO` ⚠️

### 3. Ver todos los incidentes reportados
```bash
curl http://localhost:8080/api/cyber-sentinel/incidents
```

### 4. Ver estadísticas
```bash
curl http://localhost:8080/api/cyber-sentinel/statistics
```

---

## Integración con React

Para conectar el frontend React:

```javascript
// Llamar al endpoint de predicción
const response = await fetch('http://localhost:8080/api/cyber-sentinel/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    intentos_login_fallidos: 80,
    puertos_abiertos: 40,
    vulnerabilidades_criticas: 8,
    trafico_anomalo_pct: 45,
    equipos_afectados: 200,
    parcheado_pct: 60
  })
});

const prediction = await response.json();
console.log(prediction.severity); // "MEDIO"
console.log(prediction.recommendations); // Recomendaciones automáticas
```

---

## Estructura de Componentes Implementados

### ✅ DTOs (Data Transfer Objects)
- `IncidentDataDTO` - Datos de entrada del incidente
- `PredictionResponseDTO` - Respuesta de predicción

### ✅ Modelos (Models)
- `Incident` - Entidad JPA para persistencia
- `SeverityLevel` - Enum con niveles de severidad

### ✅ Servicios (Services)
- `IncidentService` - Orquesta la predicción y almacenamiento
- `MLPredictionService` - Algoritmo de predicción con scoring ponderado

### ✅ Controladores (Controllers)
- `IncidentController` - REST endpoints
- `GlobalExceptionHandler` - Manejo centralizado de errores

### ✅ Repositorio (Repository)
- `IncidentRepository` - Acceso a datos JPA

---

## Características del Algoritmo de Predicción

- ✅ Scoring ponderado basado en 6 métricas de seguridad
- ✅ Normalización de valores (0-1)
- ✅ Cálculo automático de confianza
- ✅ Generación de recomendaciones contextuales
- ✅ Persistencia en base de datos H2
- ✅ CORS habilitado para integración con frontend

---

## Dependencias Principales

- Spring Boot 4.1.0
- Spring Data JPA
- Spring Validation
- H2 Database
- Jackson (JSON processing)
- JUnit 5

---

## Requisitos del Sistema

- Java 21 (OpenJDK o compatible)
- Maven 3.8.x o superior
- 512 MB RAM mínimo

---

## Próximos Pasos

### Para el Frontend React:
1. Crear componente de formulario para capturar las 6 métricas
2. Llamar a `POST /api/cyber-sentinel/predict`
3. Mostrar resultado con código de color según severidad
4. Mostrar recomendaciones al usuario
5. Usar `/api/cyber-sentinel/statistics` para dashboard

### Para el Backend:
1. Configurar PostgreSQL para persistencia en producción
2. Agregar autenticación JWT
3. Implementar rate limiting
4. Agregar más métricas de entrada si es necesario
5. Implementar histórico y reportes

---

## Soporte y Documentación

- API Completa: Ver `API_DOCUMENTATION.md`
- Código: Consultar archivos Java en `src/main/java/com/Pc3/CyberSentinel/`
- Tests: Ver `src/test/java/com/Pc3/CyberSentinel/CyberSentinelApplicationTests.java`

---

**¡Listo para usar!** 🚀

Todas los endpoints están implementados y funcionando correctamente.
