# UTP IA Models API - Java Script Avanzado Semana 15
## Entregable Oficial de Ciencia de Datos - CASO 3 (CyberSentinel)

Este repositorio contiene la solución completa del componente de **Ciencia de Datos (FastAPI + RandomForest)** de la Evaluación Práctica de Integración, específicamente resuelto con total fidelidad para el **CASO 3: CyberSentinel (Priorizador de incidentes de ciberseguridad)**.

---

## 🚀 Guía de Instalación y Ejecución del Modelo de IA (FastAPI)

Para ejecutar el servicio local en el puerto `8001` requerido para la pasarela de Spring Boot:

```bash
# 1. Crear el entorno virtual en Python
python -m venv venv

# 2. Activar el entorno virtual
# En Windows (CMD o PowerShell):
venv\Scripts\activate
# En Linux o macOS:
source venv/bin/activate

# 3. Instalar las librerías necesarias
pip install -r requirements.txt

# 4. Levantar el servicio con Uvicorn
uvicorn app:app --reload --port 8001
```

Una vez ejecutado, la documentación Swagger del modelo estará accesible en:
👉 **`http://localhost:8001/docs`**

---

## 🛡️ Caso 3: CyberSentinel - Priorización Inteligente de Incidentes

### 📊 Especificación de Variables Técnicas
El modelo recibe un vector de características de red de la infraestructura atacada:

| Variable | Rango | Significado Técnico | Peso Directo en el Riesgo |
| :--- | :--- | :--- | :--- |
| `intentos_login_fallidos` | `0 – 200` | Intentos fallidos de autenticación (fuerza bruta). | `x 0.25` |
| `puertos_abiertos` | `0 – 100` | Puertos expuestos externamente detectados. | `x 0.45` |
| `vulnerabilidades_criticas` | `0 – 20` | Cantidad de CVEs críticos sin parches activos. | **`x 7.00`** *(Multiplicador Crítico)* |
| `trafico_anomalo_pct` | `0.0 – 100.0` | Porcentaje de tráfico fuera del patrón basal. | `x 0.80` |
| `equipos_afectados` | `0 – 500` | Cantidad de hosts o servidores involucrados. | `x 0.18` |
| `parcheado_pct` | `0.0 – 100.0` | Porcentaje de activos con parches de seguridad al día. | `(100 - patch) x 0.65` *(Mitigante)* |

### 📐 Ecuación Matemática del Score de Riesgo (Fronteras de Decisión)
La lógica del etiquetado sintético de entrenamiento se define como:
$$\text{risk} = (\text{logins} \times 0.25) + (\text{ports} \times 0.45) + (\text{vulns} \times 7.00) + (\text{traf} \times 0.80) + (\text{equipos} \times 0.18) + (100 - \text{patch}) \times 0.65$$

*   **BAJO:** $\text{risk} < 40$
*   **MEDIO:** $40 \le \text{risk} < 75$
*   **ALTO:** $75 \le \text{risk} < 115$
*   **CRITICO:** $\text{risk} \ge 115$

---

## 📝 Contratos de Integración de Extremo a Extremo

### 1. Spring Boot (Pasarela Intermedia / Gateway)
Spring Boot recibe la solicitud JSON desde React en el puerto `8080`, valida los datos y la reenvía a Python (`http://localhost:8001`):

```java
@RestController
@RequestMapping("/api/prediccion")
@CrossOrigin(origins = "http://localhost:5173")
public class PrediccionController {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_URL = "http://localhost:8001";

    @PostMapping("/cyber-sentinel")
    public ResponseEntity<String> predecirCyberSentinel(@RequestBody Map<String, Object> datos) {
        String url = PYTHON_URL + "/predict/cyber-sentinel";
        String respuesta = restTemplate.postForObject(url, datos, String.class);
        return ResponseEntity.ok(respuesta);
    }
}
```

### 2. React (Consumo del Servicio)
Consumo del endpoint expuesto en Spring Boot mediante Axios:

```javascript
import axios from "axios";

export async function predecirIncidenteCyber(formData) {
  const response = await axios.post(
    "http://localhost:8080/api/prediccion/cyber-sentinel",
    formData
  );
  return response.data;
}
```

---

## 👩‍🏫 Guion de Sustentación Técnica (Sustentación Individual / Grupal)

**¿Por qué un incidente clasificado como CRÍTICO debe ser escalado inmediatamente y qué evidencia lo demuestra?**

*   **Evidencia Matemática (Ecuación de Riesgo):** La variable con mayor peso y relevancia de clasificación en el modelo RandomForest es `vulnerabilidades_criticas`, la cual posee un factor multiplicador masivo de **`7.00`**. Si un sistema posee 15 vulnerabilidades críticas abiertas, esto solo aporta instantáneamente $15 \times 7 = 105$ puntos de riesgo, dejándolo a un paso de la frontera crítica ($\ge 115$).
*   **Análisis Combinatorio Activo:** Si el ataque combina este agujero con un tráfico anómalo elevado (multiplicador $0.80$) e intentos de login por fuerza bruta ($0.25$), se cruza inmediatamente el umbral crítico. Esto demuestra matemáticamente que la combinación de vulnerabilidad expuesta más ataque activo representa un peligro extremo de secuestro o fuga de datos (Ransomware), justificando plenamente el aislamiento inmediato de la red (escalamiento inmediato).
