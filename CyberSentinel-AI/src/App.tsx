import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Play, 
  Database, 
  BookOpen, 
  Cpu, 
  Copy, 
  Check, 
  RotateCcw, 
  Info, 
  Sliders, 
  FileCode, 
  TrendingUp, 
  Layers, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { 
  generateCyberData, 
  predictCyberSentinel, 
  PredictionPayload, 
  PredictionResult, 
  PYTHON_APP_CODE, 
  PYTHON_REQUIREMENTS_CODE, 
  SPRING_BOOT_CONTROLLER, 
  REACT_SERVICE_CODE,
  CyberIncident
} from "./data";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --- STATE ---
  const [inputs, setInputs] = useState<PredictionPayload>({
    intentos_login_fallidos: 120,
    puertos_abiertos: 35,
    vulnerabilidades_criticas: 8,
    trafico_anomalo_pct: 76,
    equipos_afectados: 90,
    parcheado_pct: 48,
  });

  const [activeTab, setActiveTab] = useState<"probabilities" | "dataset" | "sustentation" | "code">("probabilities");
  const [activeCodeTab, setActiveCodeTab] = useState<"python" | "requirements" | "springboot" | "react">("python");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [incidentsHistory, setIncidentsHistory] = useState<PredictionResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterClass, setFilterClass] = useState<string>("TODOS");
  const [datasetPage, setDatasetPage] = useState<number>(0);

  // Generate training dataset once
  const trainingDataset = useMemo(() => generateCyberData(), []);

  // Compute dataset metrics
  const datasetStats = useMemo(() => {
    const total = trainingDataset.length;
    const counts = { CRITICO: 0, ALTO: 0, MEDIO: 0, BAJO: 0 };
    let sumRisk = 0;
    
    trainingDataset.forEach(row => {
      counts[row.label]++;
      sumRisk += row.risk;
    });

    return {
      total,
      counts,
      avgRisk: Math.round((sumRisk / total) * 100) / 100,
    };
  }, [trainingDataset]);

  // Compute current prediction
  const currentPrediction = useMemo(() => {
    return predictCyberSentinel(inputs);
  }, [inputs]);

  // Add initial prediction to log history once on mount
  useEffect(() => {
    setIncidentsHistory([currentPrediction]);
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (field: keyof PredictionPayload, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = () => {
    const result = predictCyberSentinel(inputs);
    setIncidentsHistory(prev => [result, ...prev.slice(0, 19)]);
  };

  const handleReset = () => {
    setInputs({
      intentos_login_fallidos: 120,
      puertos_abiertos: 35,
      vulnerabilidades_criticas: 8,
      trafico_anomalo_pct: 76,
      equipos_afectados: 90,
      parcheado_pct: 48,
    });
  };

  const handleLoadSample = (sample: CyberIncident | PredictionPayload) => {
    const loadedInputs = {
      intentos_login_fallidos: sample.intentos_login_fallidos,
      puertos_abiertos: sample.puertos_abiertos,
      vulnerabilidades_criticas: sample.vulnerabilidades_criticas,
      trafico_anomalo_pct: sample.trafico_anomalo_pct,
      equipos_afectados: sample.equipos_afectados,
      parcheado_pct: sample.parcheado_pct,
    };
    setInputs(loadedInputs);
    
    const result = predictCyberSentinel(loadedInputs);
    setIncidentsHistory(prev => [result, ...prev.slice(0, 19)]);
  };

  const handleCopyCode = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(tabId);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter training dataset
  const filteredDataset = useMemo(() => {
    return trainingDataset.filter(row => {
      const matchesSearch = 
        row.id.toString().includes(searchTerm) || 
        row.risk.toString().includes(searchTerm) ||
        row.vulnerabilidades_criticas.toString().includes(searchTerm);
      
      const matchesFilter = filterClass === "TODOS" || row.label === filterClass;
      return matchesSearch && matchesFilter;
    });
  }, [trainingDataset, searchTerm, filterClass]);

  const itemsPerPage = 8;
  const paginatedDataset = useMemo(() => {
    const start = datasetPage * itemsPerPage;
    return filteredDataset.slice(start, start + itemsPerPage);
  }, [filteredDataset, datasetPage]);

  const maxPages = Math.ceil(filteredDataset.length / itemsPerPage);

  useEffect(() => {
    setDatasetPage(0);
  }, [searchTerm, filterClass]);

  // Dynamic colors based on predicted class
  const classMetadata = {
    CRITICO: {
      colorBg: "bg-red-950/40 border-red-800 text-red-400",
      colorBadge: "bg-red-500 text-white",
      colorText: "text-red-500 font-bold",
      colorGlow: "shadow-red-500/20",
      colorGradient: "from-red-500 to-rose-600",
      iconColor: "text-red-500",
      lightBg: "bg-red-500/10",
      barColor: "bg-red-500",
      description: "Nivel de amenaza extremo. Se requiere contención inmediata de red, aislamiento de host y notificación al equipo directivo de seguridad nacional o corporativo."
    },
    ALTO: {
      colorBg: "bg-amber-950/40 border-amber-800 text-amber-400",
      colorBadge: "bg-amber-500 text-white",
      colorText: "text-amber-500 font-bold",
      colorGlow: "shadow-amber-500/20",
      colorGradient: "from-amber-500 to-orange-600",
      iconColor: "text-amber-500",
      lightBg: "bg-amber-500/10",
      barColor: "bg-amber-500",
      description: "Nivel de amenaza importante. Requiere investigación inmediata, bloqueo de accesos anómalos y parchado urgente en sistemas afectados en las próximas 12 horas."
    },
    MEDIO: {
      colorBg: "bg-yellow-950/20 border-yellow-800 text-yellow-400",
      colorBadge: "bg-yellow-500 text-slate-900",
      colorText: "text-yellow-500 font-bold",
      colorGlow: "shadow-yellow-500/10",
      colorGradient: "from-yellow-400 to-amber-500",
      iconColor: "text-yellow-500",
      lightBg: "bg-yellow-500/10",
      barColor: "bg-yellow-500",
      description: "Nivel de amenaza moderado. Requiere monitoreo continuo de los hosts involucrados y calendarización de tareas de parchado preventivo en el siguiente ciclo semanal."
    },
    BAJO: {
      colorBg: "bg-emerald-950/30 border-emerald-800 text-emerald-400",
      colorBadge: "bg-emerald-500 text-white",
      colorText: "text-emerald-500 font-bold",
      colorGlow: "shadow-emerald-500/10",
      colorGradient: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-500",
      lightBg: "bg-emerald-500/10",
      barColor: "bg-emerald-500",
      description: "Nivel de amenaza mínimo. Actividades de red normales. No requiere escalamiento; documentar el evento para auditorías periódicas estándar."
    }
  };

  const getMetadata = (clase: string) => {
    const key = clase as keyof typeof classMetadata;
    return classMetadata[key] || classMetadata.BAJO;
  };

  const variablesList = [
    { name: "intentos_login_fallidos", label: "Intentos login fallidos", min: 0, max: 200, unit: "intentos", step: 1, desc: "Intentos fallidos de autenticación en servidores" },
    { name: "puertos_abiertos", label: "Puertos abiertos", min: 0, max: 100, unit: "puertos", step: 1, desc: "Puertos de red detectados expuestos externamente" },
    { name: "vulnerabilidades_criticas", label: "Vulnerabilidades críticas", min: 0, max: 20, unit: "CVEs", step: 1, desc: "Vulnerabilidades críticas sin parchar detectadas" },
    { name: "trafico_anomalo_pct", label: "Tráfico anómalo", min: 0, max: 100, unit: "%", step: 0.1, desc: "Porcentaje de tráfico de red fuera del patrón basal" },
    { name: "equipos_afectados", label: "Equipos afectados", min: 0, max: 500, unit: "hosts", step: 1, desc: "Cantidad de servidores o estaciones afectadas" },
    { name: "parcheado_pct", label: "Porcentaje parchado", min: 0, max: 100, unit: "%", step: 0.1, desc: "Porcentaje de activos con parches de seguridad al día" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-slate-800 selection:text-cyan-400" id="cybersentinel_root">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP DECORATIVE TECH LINE */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 w-full" id="tech_accent_line" />

      {/* HEADER SECTION */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-widest font-mono text-cyan-400 font-bold bg-cyan-950/50 border border-cyan-800/60 px-2 py-0.5 rounded">
                  CASO 3 • EVALUACIÓN
                </span>
                <span className="text-xs tracking-widest font-mono text-slate-400">
                  UTP • JAVASCRIPT AVANZADO
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                CyberSentinel AI: <span className="text-slate-300 font-medium text-lg sm:text-xl">Módulo de Ciencia de Datos</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
            <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Modelo: <strong className="text-white">Random Forest (Scikit-Learn)</strong></span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Dataset: <strong className="text-white">300 Muestras Sintéticas</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* BRIEF NOTE */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Sección de Ciencia de Datos Resuelta.</strong> Este módulo demuestra el algoritmo predictivo RandomForestClassifier entrenado sobre el dataset sintético, expone el código de Python FastAPI y provee la pasarela de consumo para Spring Boot y React.
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:py-8 flex flex-col gap-8">
        
        {/* ROW 1: SIMULATOR & MODEL PREDICTION OUTCOME */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: SLIDERS & PARAMETERS FORM (5 COLS) */}
          <section className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl" id="parameter_form_card">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold tracking-wider text-slate-300 font-mono uppercase">
                  Parámetros del Incidente
                </h2>
              </div>
              <button 
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg transition-all font-mono cursor-pointer"
                title="Resetear a valores predeterminados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Modifique los indicadores técnicos de la infraestructura para simular cómo el modelo entrenado RandomForest clasifica la severidad del incidente.
            </p>

            <div className="flex flex-col gap-4">
              {variablesList.map((variable) => {
                const value = inputs[variable.name as keyof PredictionPayload];
                return (
                  <div key={variable.name} className="bg-slate-950/40 border border-slate-800/40 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {variable.label}
                      </label>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <input
                          type="number"
                          min={variable.min}
                          max={variable.max}
                          step={variable.step}
                          value={value}
                          onChange={(e) => {
                            let val = parseFloat(e.target.value);
                            if (isNaN(val)) val = variable.min;
                            val = Math.max(variable.min, Math.min(variable.max, val));
                            handleInputChange(variable.name as keyof PredictionPayload, val);
                          }}
                          className="w-16 bg-slate-900 border border-slate-700/60 text-slate-100 text-center rounded py-0.5 px-1 font-bold text-cyan-400 focus:outline-none"
                        />
                        <span className="text-slate-500 w-10">{variable.unit}</span>
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      min={variable.min}
                      max={variable.max}
                      step={variable.step}
                      value={value}
                      onChange={(e) => handleInputChange(variable.name as keyof PredictionPayload, parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handlePredict}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Ejecutar Inferencia / Clasificar</span>
            </button>
          </section>

          {/* COLUMN 2: REAL-TIME INFERENCE OUTCOME (7 COLS) */}
          <section className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            {/* LARGE SEVERITY OUTCOME CARD */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-6 relative" id="inference_result_card">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-semibold tracking-wider text-slate-300 font-mono uppercase">
                    Predicción en Tiempo Real
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Inferencia Activa</span>
                </div>
              </div>

              {/* CORE PREDICTOR OUTCOME METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* SEMAPHORE VISUAL (5 COLS) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800/80 py-6 px-4 rounded-2xl text-center relative overflow-hidden">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">SEVERIDAD PREDICHA</span>
                  
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative ${getMetadata(currentPrediction.prediccion).colorBg} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                    <ShieldAlert className="w-10 h-10" />
                  </div>

                  <span className={`text-2xl sm:text-3xl font-black mt-4 tracking-wider transition-all duration-500 ${getMetadata(currentPrediction.prediccion).colorText}`}>
                    {currentPrediction.prediccion}
                  </span>

                  <div className="mt-3 flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400">CONFIANZA DEL MODELO</span>
                    <span className="text-lg font-bold font-mono text-white mt-0.5">
                      {Math.round(currentPrediction.confianza * 10000) / 100}%
                    </span>
                  </div>
                </div>

                {/* TECH EXPLANATION METRICS (7 COLS) */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Cálculo de Riesgo Matemático</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white">{currentPrediction.risk}</span>
                      <span className="text-xs font-mono text-slate-400">puntos</span>
                    </div>
                    
                    {/* Progress indicator inside range thresholds */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3.5 relative">
                      <div className="absolute left-[16%] top-0 w-0.5 h-full bg-slate-950/80 z-10" title="Threshold MEDIO (40)" />
                      <div className="absolute left-[30%] top-0 w-0.5 h-full bg-slate-950/80 z-10" title="Threshold ALTO (75)" />
                      <div className="absolute left-[46%] top-0 w-0.5 h-full bg-slate-950/80 z-10" title="Threshold CRITICO (115)" />
                      
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getMetadata(currentPrediction.prediccion).barColor}`}
                        style={{ width: `${Math.min(100, (currentPrediction.risk / 250) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>0 (Mín)</span>
                      <span>40 (MEDIO)</span>
                      <span>75 (ALTO)</span>
                      <span>115 (CRÍTIC)</span>
                      <span>250 (Máx)</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 border-l-2 border-slate-700 pl-3 py-1">
                    <strong className="text-slate-100">Evaluación:</strong> {getMetadata(currentPrediction.prediccion).description}
                  </div>
                </div>
              </div>

              {/* ACTIONABLE RECOMMENDATIONS BLOCK */}
              <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
                <span className="text-xs font-mono tracking-wider text-slate-300 font-semibold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Acciones y Recomendaciones de Respuesta
                </span>
                
                <ul className="flex flex-col gap-2">
                  {currentPrediction.recomendaciones.map((tip, index) => (
                    <li key={index} className="text-xs flex items-start gap-2 text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/40">
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${getMetadata(currentPrediction.prediccion).iconColor}`} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* MODEL RUNTIME HISTORY LOG */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Bitácora Local de Evaluaciones en Sesión</span>
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                {incidentsHistory.map((hist, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between text-xs bg-slate-950/60 border border-slate-800/40 px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getMetadata(hist.prediccion).barColor}`} />
                      <span className="font-mono text-slate-400">Inferencia #{incidentsHistory.length - idx}</span>
                      <span className={`text-[10px] font-mono ${getMetadata(hist.prediccion).colorText}`}>
                        [{hist.prediccion}]
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>Riesgo: <strong className="text-white">{hist.risk}</strong></span>
                      <span>Conf: <strong className="text-white">{Math.round(hist.confianza * 100)}%</strong></span>
                      <button 
                        onClick={() => handleLoadSample(hist.entrada)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-sans hover:underline cursor-pointer"
                      >
                        Cargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>

        {/* ROW 2: TABS WITH EXPERIMENTS, DATASET STATISTICS AND SOURCE CODES */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="interactive_tabs_section">
          
          {/* TAB HEADERS */}
          <div className="flex flex-wrap border-b border-slate-800 bg-slate-900/50">
            <button
              onClick={() => setActiveTab("probabilities")}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-medium tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === "probabilities" 
                  ? "border-cyan-500 text-white bg-slate-950/40" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Probabilidades de Clases</span>
            </button>
            <button
              onClick={() => setActiveTab("dataset")}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-medium tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === "dataset" 
                  ? "border-cyan-500 text-white bg-slate-950/40" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Explorador de Dataset (300)</span>
            </button>
            <button
              onClick={() => setActiveTab("sustentation")}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-medium tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === "sustentation" 
                  ? "border-cyan-500 text-white bg-slate-950/40" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Sustentación del Reto</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-medium tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === "code" 
                  ? "border-cyan-500 text-white bg-slate-950/40" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Código Entregable</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="p-6">
            
            {/* TAB 1: PROBABILITIES */}
            {activeTab === "probabilities" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Distribución de Probabilidades de Clasificación
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Representación del vector probabilístico devuelto por la función <code className="text-slate-200 font-mono bg-slate-950 px-1 py-0.5 rounded text-[11px]">predict_proba()</code> del RandomForest. Indica qué tan seguro está el modelo en comparación con otras clases.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                  <div className="flex flex-col gap-4">
                    {currentPrediction.ranking.map((rank) => {
                      const isWinning = rank.clase === currentPrediction.prediccion;
                      const percentage = Math.round(rank.probabilidad * 100);
                      
                      return (
                        <div key={rank.clase} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className={`font-bold flex items-center gap-1.5 ${isWinning ? getMetadata(rank.clase).colorText : "text-slate-400"}`}>
                              {rank.clase}
                              {isWinning && <span className="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.2 rounded font-mono font-medium">WINNING</span>}
                            </span>
                            <span className="text-slate-300 font-bold">{percentage}%</span>
                          </div>
                          
                          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isWinning 
                                  ? getMetadata(rank.clase).barColor 
                                  : "bg-slate-700/60"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 border-l border-slate-800 pl-6 text-slate-300 text-xs">
                    <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">Insight Técnico de RandomForest</span>
                    <p className="leading-relaxed">
                      El clasificador de bosque aleatorio (<strong className="text-white">Random Forest</strong>) con <strong className="text-white">180 árboles de decisión</strong> vota independientemente en base a cortes en las variables. Las probabilidades visualizadas arriba representan el porcentaje de árboles individuales que clasificaron el vector de entrada en cada categoría de severidad.
                    </p>
                    <p className="leading-relaxed">
                      Cuando los indicadores de red están cerca de los umbrales matemáticos (por ejemplo, un riesgo de 114, que está rozando el límite crítico de 115), las probabilidades se distribuyen equitativamente entre las categorías colindantes. Esto representa un <strong className="text-cyan-400">comportamiento probabilístico suavizado</strong> en la frontera de decisión.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DATASET EXPLORER */}
            {activeTab === "dataset" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    Explorador de Datos Sintéticos de Entrenamiento
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visualice el conjunto de datos de entrenamiento sintetizado mediante la semilla aleatoria estable (<code className="text-slate-200 font-mono bg-slate-950 px-1 py-0.5 rounded text-[11px]">RANDOM_STATE + 2</code>). Contiene 300 incidentes para entrenar el clasificador.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Muestras Totales</span>
                    <span className="block text-2xl font-bold font-mono text-white mt-1">{datasetStats.total}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-emerald-500 uppercase">Total BAJO</span>
                    <span className="block text-2xl font-bold font-mono text-emerald-400 mt-1">{datasetStats.counts.BAJO}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-yellow-500 uppercase">Total MEDIO</span>
                    <span className="block text-2xl font-bold font-mono text-yellow-400 mt-1">{datasetStats.counts.MEDIO}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-amber-500 uppercase">Total ALTO</span>
                    <span className="block text-2xl font-bold font-mono text-amber-400 mt-1">{datasetStats.counts.ALTO}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-red-500 uppercase">Total CRÍTICO</span>
                    <span className="block text-2xl font-bold font-mono text-red-400 mt-1">{datasetStats.counts.CRITICO}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950/30 p-4 border border-slate-800/80 rounded-xl">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-mono">Filtro:</span>
                      <select 
                        value={filterClass} 
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="bg-slate-900 border border-slate-700/80 text-xs text-white rounded-lg py-1 px-2.5 focus:outline-none font-mono"
                      >
                        <option value="TODOS">TODAS LAS CLASES</option>
                        <option value="BAJO">BAJO</option>
                        <option value="MEDIO">MEDIO</option>
                        <option value="ALTO">ALTO</option>
                        <option value="CRITICO">CRITICO</option>
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Buscar por ID, Riesgo o CVEs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-slate-900 border border-slate-700/80 text-xs py-1.5 px-3 rounded-lg text-white focus:outline-none font-mono placeholder:text-slate-600"
                  />
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <th className="p-3">ID Muestra</th>
                        <th className="p-3">Logins Fallidos</th>
                        <th className="p-3">Puertos Abiertos</th>
                        <th className="p-3">CVEs Críticos</th>
                        <th className="p-3">Tráfico %</th>
                        <th className="p-3">Equipos</th>
                        <th className="p-3">Parchado %</th>
                        <th className="p-3">Score Riesgo</th>
                        <th className="p-3">Clase Real</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDataset.map((row) => (
                        <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 text-cyan-400 font-bold">#{row.id}</td>
                          <td className="p-3">{row.intentos_login_fallidos}</td>
                          <td className="p-3">{row.puertos_abiertos}</td>
                          <td className="p-3 font-semibold text-slate-200">{row.vulnerabilidades_criticas}</td>
                          <td className="p-3">{row.trafico_anomalo_pct}%</td>
                          <td className="p-3">{row.equipos_afectados}</td>
                          <td className="p-3">{row.parcheado_pct}%</td>
                          <td className="p-3 font-bold text-indigo-300">{row.risk}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${getMetadata(row.label).colorBg} border`}>
                              {row.label}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleLoadSample(row)}
                              className="text-[11px] font-sans text-cyan-400 hover:text-cyan-300 hover:underline bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded cursor-pointer"
                            >
                              Cargar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {maxPages > 1 && (
                  <div className="flex items-center justify-between bg-slate-900/30 p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">
                      Mostrando {datasetPage * itemsPerPage + 1}-{Math.min(filteredDataset.length, (datasetPage + 1) * itemsPerPage)} de {filteredDataset.length} filas
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDatasetPage(p => Math.max(0, p - 1))}
                        disabled={datasetPage === 0}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 py-1 px-3 rounded text-white cursor-pointer font-mono"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setDatasetPage(p => Math.min(maxPages - 1, p + 1))}
                        disabled={datasetPage === maxPages - 1}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 py-1 px-3 rounded text-white cursor-pointer font-mono"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUSTENTATION EXPLANATION (RETO ESPECIAL) */}
            {activeTab === "sustentation" && (
              <div className="flex flex-col gap-6 text-slate-300 text-xs leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    Sustentación del Reto Especial de Evaluación
                  </h3>
                  <p className="text-slate-400 mt-1">
                    Preparación técnica y justificación matemática rigurosa para la exposición en aula frente al profesor.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-7 flex flex-col gap-4 bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
                    <div className="border-l-4 border-amber-500 pl-3">
                      <span className="text-xs font-mono text-amber-500 font-bold uppercase block">PREGUNTA DEL RETO</span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        ¿Por qué una alerta crítica se debe escalar y qué evidencia lo demuestra?
                      </h4>
                    </div>

                    <p>
                      Para justificar técnicamente ante el evaluador por qué una alerta se clasifica como <strong className="text-red-400">CRÍTICA</strong> y se debe escalar, se debe apelar a la <strong className="text-white">Fórmula de Riesgo Basal</strong> del dataset sintético y el peso relativo de las variables (Feature Importance).
                    </p>
                    
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg my-1">
                      <span className="block text-[10px] font-mono text-slate-500 mb-2 uppercase font-bold">FÓRMULA MATEMÁTICA DE CLASIFICACIÓN</span>
                      <code className="block text-xs text-cyan-300 font-mono break-all leading-normal">
                        risk = logins * 0.25 + ports * 0.45 + vulns * 7.00 + traf * 0.80 + equipos * 0.18 + (100 - patch) * 0.65
                      </code>
                      <span className="block text-[10px] text-slate-500 mt-2">
                        Umbral Crítico: <code className="text-white bg-slate-950 px-1 font-mono">risk &gt;= 115</code>
                      </span>
                    </div>

                    <p>
                      <strong className="text-white">1. Evidencia de Impacto Extremo (Vulnerabilidades Críticas):</strong>
                      <br />
                      La variable <code className="text-yellow-400 font-mono bg-slate-900 px-1">vulnerabilidades_criticas</code> tiene un multiplicador gigantesco de <strong className="text-white font-mono">7.0</strong>. Esto significa que cada sola vulnerabilidad crítica descubierta aporta instantáneamente 7 puntos de riesgo directos. Un valor alto (ej. 15 vulnerabilidades) aporta <strong className="text-white">105 puntos de riesgo</strong> por sí solo, dejándolo a solo 10 puntos de cruzar el umbral de CRÍTICO. Esto demuestra que la debilidad de parcheado de vulnerabilidades CVSS es la variable técnica más crítica del sistema.
                    </p>

                    <p>
                      <strong className="text-white">2. Evidencia de Actividad Maliciosa Activa (Tráfico Anómalo y Logins Fallidos):</strong>
                      <br />
                      El tráfico anómalo (<code className="text-yellow-400 font-mono bg-slate-900 px-1">trafico_anomalo_pct</code>) tiene un peso de <strong className="text-white font-mono">0.80</strong>. Si el tráfico sube al 80%, aporta <strong className="text-white">64 puntos de riesgo</strong> adicionales. Si se combina con ataques de fuerza bruta (<code className="text-yellow-400 font-mono bg-slate-900 px-1">intentos_login_fallidos</code>), esto es una evidencia matemática indudable de un ataque coordinado en proceso que requiere escalamiento táctico.
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-col gap-4 bg-slate-950/40 p-5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Demostración Táctica de Laboratorio
                    </span>
                    
                    <p className="text-slate-400 leading-normal">
                      Haga clic en cualquiera de estos escenarios preconfigurados para inyectarlos en el simulador y demostrarle al evaluador cómo interactúan las variables y los pesos.
                    </p>

                    <div className="flex flex-col gap-3">
                      <div 
                        onClick={() => handleLoadSample({
                          intentos_login_fallidos: 15,
                          puertos_abiertos: 10,
                          vulnerabilidades_criticas: 16,
                          trafico_anomalo_pct: 12,
                          equipos_afectados: 20,
                          parcheado_pct: 90,
                        })}
                        className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-3 rounded-lg transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white font-mono">Escenario A: Agujero de Seguridad Puro</span>
                          <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded font-mono border border-red-800">CRÍTICO</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Ataque mínimo, pero vulnerabilidades críticas extremas (16 CVEs). Demuestra el impacto devastador del multiplicador de <strong className="text-white">7.0</strong>.
                        </p>
                      </div>

                      <div 
                        onClick={() => handleLoadSample({
                          intentos_login_fallidos: 170,
                          puertos_abiertos: 75,
                          vulnerabilidades_criticas: 1,
                          trafico_anomalo_pct: 95,
                          equipos_afectados: 180,
                          parcheado_pct: 95,
                        })}
                        className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-3 rounded-lg transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white font-mono">Escenario B: Ataque Activo Coordinado</span>
                          <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded font-mono border border-amber-800">ALTO / CRÍTICO</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Pocas vulnerabilidades pero logins fallidos masivos (170) y tráfico de red anómalo (95%). Demuestra detección de ataque en tiempo real.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DELIVERABLE CODES */}
            {activeTab === "code" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-emerald-400" />
                      Código de Integración de Ciencia de Datos
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Descargue o copie el código de las tres capas (Python, Spring Boot y React) que debe entregar para sustentar la PC3 grupal.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Code file selection navigation */}
                  <div className="lg:col-span-3 flex flex-col gap-2">
                    <button
                      onClick={() => setActiveCodeTab("python")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                        activeCodeTab === "python" 
                          ? "bg-slate-900 border-cyan-500 text-white font-semibold" 
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>1. Python (app.py)</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-bold uppercase">FastAPI</span>
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("requirements")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                        activeCodeTab === "requirements" 
                          ? "bg-slate-900 border-cyan-500 text-white font-semibold" 
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>2. Python (requirements.txt)</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">Deps</span>
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("springboot")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                        activeCodeTab === "springboot" 
                          ? "bg-slate-900 border-cyan-500 text-white font-semibold" 
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>3. Spring Boot (Pasarela)</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400 font-bold uppercase">Java</span>
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("react")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                        activeCodeTab === "react" 
                          ? "bg-slate-900 border-cyan-500 text-white font-semibold" 
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>4. React (Servicio Axios)</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold uppercase">JS / TS</span>
                    </button>
                  </div>

                  {/* Code editor visualization */}
                  <div className="lg:col-span-9 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800">
                      <span className="text-xs font-mono text-slate-400">
                        {activeCodeTab === "python" && "app.py — Archivo Python FastAPI con RandomForest"}
                        {activeCodeTab === "requirements" && "requirements.txt — Dependencias de Ciencia de Datos"}
                        {activeCodeTab === "springboot" && "PrediccionController.java — Controlador Pasarela REST"}
                        {activeCodeTab === "react" && "predecirIncidenteCyber.ts — Función de Cliente React"}
                      </span>
                      <button
                        onClick={() => {
                          const codeText = 
                            activeCodeTab === "python" ? PYTHON_APP_CODE :
                            activeCodeTab === "requirements" ? PYTHON_REQUIREMENTS_CODE :
                            activeCodeTab === "springboot" ? SPRING_BOOT_CONTROLLER : REACT_SERVICE_CODE;
                          handleCopyCode(codeText, activeCodeTab);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 font-mono cursor-pointer transition-all"
                      >
                        {copiedText === activeCodeTab ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Código</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 max-h-[400px] overflow-auto">
                      <pre className="text-xs font-mono text-slate-300 whitespace-pre">
                        <code>
                          {activeCodeTab === "python" && PYTHON_APP_CODE}
                          {activeCodeTab === "requirements" && PYTHON_REQUIREMENTS_CODE}
                          {activeCodeTab === "springboot" && SPRING_BOOT_CONTROLLER}
                          {activeCodeTab === "react" && REACT_SERVICE_CODE}
                        </code>
                      </pre>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 text-center py-6 px-4 mt-12 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>UTP • Java Script Avanzado • PC3 • Semana 15</span>
          <span className="flex items-center gap-1">
            Módulo de Ciencia de Datos creado de extremo a extremo con <ShieldCheck className="w-4 h-4 text-cyan-500 inline" />
          </span>
        </div>
      </footer>

    </div>
  );
}
