import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, AlertTriangle, Play, Square, RotateCcw, ChevronRight } from 'lucide-react';
import type { Vitals, RiskResult, ScenarioKey } from './types';
import { computeRisk } from './model';
import { scenarios } from './scenarios';
import RiskGauge from './components/RiskGauge';
import BodyFigure from './components/BodyFigure';
import VitalSlider from './components/VitalSlider';
import VitalCard from './components/VitalCard';
import SOFABars from './components/SOFABars';
import RiskTimeline from './components/RiskTimeline';

const DEFAULT_VITALS: Vitals = {
  temp: 37.2,
  bp: 120,
  hr: 80,
  spo2: 98,
  rr: 16,
  lac: 1.0,
  wbc: 8.5,
};

const levelColor: Record<string, string> = {
  safe: '#22c55e',
  warn: '#eab308',
  elevated: '#f97316',
  critical: '#ef4444',
};

function vitalColor(key: keyof Vitals, value: number): string {
  const thresholds: Record<string, { warn: number; crit: number; dir: 'hi' | 'lo' | 'both' }> = {
    temp:  { warn: 38.3, crit: 39.5, dir: 'both' },
    bp:    { warn: 90,   crit: 70,   dir: 'lo' },
    hr:    { warn: 100,  crit: 125,  dir: 'hi' },
    spo2:  { warn: 95,   crit: 90,   dir: 'lo' },
    rr:    { warn: 20,   crit: 28,   dir: 'hi' },
    lac:   { warn: 2,    crit: 4,    dir: 'hi' },
    wbc:   { warn: 12,   crit: 18,   dir: 'hi' },
  };
  const t = thresholds[key];
  if (!t) return '#94a3b8';
  if (t.dir === 'hi') {
    if (value >= t.crit) return '#ef4444';
    if (value >= t.warn) return '#f97316';
    return '#22c55e';
  }
  if (t.dir === 'lo') {
    if (value <= t.crit) return '#ef4444';
    if (value <= t.warn) return '#f97316';
    return '#22c55e';
  }
  if (key === 'temp') {
    if (value >= 39.5 || value < 36) return '#ef4444';
    if (value >= 38.3 || value < 36.5) return '#f97316';
    return '#22c55e';
  }
  return '#22c55e';
}

export default function App() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [vitals, setVitals] = useState<Vitals>(DEFAULT_VITALS);
  const [result, setResult] = useState<RiskResult>(computeRisk(DEFAULT_VITALS));
  const [history, setHistory] = useState<number[]>([computeRisk(DEFAULT_VITALS).score]);
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('septic');
  const [simStep, setSimStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pushHistory = useCallback((score: number) => {
    setHistory(h => [...h.slice(-60), score]);
  }, []);

  useEffect(() => {
    const r = computeRisk(vitals);
    setResult(r);
    pushHistory(r.score);
  }, [vitals, pushHistory]);

  const setVital = (key: keyof Vitals) => (v: number) => {
    setVitals(prev => ({ ...prev, [key]: v }));
  };

  const runStep = useCallback((step: number) => {
    const scenario = scenarios[activeScenario];
    if (step >= scenario.steps.length) {
      setIsPlaying(false);
      return;
    }
    setVitals(scenario.steps[step]);
    setSimStep(step);
    timerRef.current = setTimeout(() => runStep(step + 1), 1800);
  }, [activeScenario]);

  const startSim = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSimStep(0);
    setIsPlaying(true);
    setVitals(scenarios[activeScenario].steps[0]);
    timerRef.current = setTimeout(() => runStep(1), 1800);
  };

  const stopSim = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
  };

  const resetAll = () => {
    stopSim();
    setSimStep(-1);
    setVitals(DEFAULT_VITALS);
    setHistory([computeRisk(DEFAULT_VITALS).score]);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const color = levelColor[result.level];
  const isCritical = result.level === 'critical';
  const totalSteps = scenarios[activeScenario].steps.length;

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#0a0f1a', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }
        @keyframes alert-flash {
          0%,100% { box-shadow: 0 0 0 0 transparent; }
          50% { box-shadow: 0 0 24px 4px #ef444455; }
        }
        .pulse-dot { animation: pulse-dot 1.2s ease-in-out infinite; }
        .alert-critical { animation: alert-flash 1.2s ease-in-out infinite; }
        input[type=range]::-webkit-slider-thumb { display:none; }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg" style={{ background: '#22c55e22' }}>
            <Activity size={18} color="#22c55e" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white">SEPSIS SENTINEL</h1>
            <p className="text-xs text-slate-500">AI-Powered Clinical Risk Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: color }} />
            <span className="text-xs text-slate-400 font-mono">LIVE</span>
          </div>
          <div className="text-xs text-slate-600 font-mono hidden md:block">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {/* Critical Alert Banner */}
      {isCritical && (
        <div
          className="alert-critical flex items-center gap-3 px-6 py-2 text-sm font-semibold"
          style={{ background: '#ef444411', border: '1px solid #ef444433', color: '#ef4444' }}
        >
          <AlertTriangle size={16} />
          SEPTIC SHOCK THRESHOLD EXCEEDED — Immediate intervention required
          <ChevronRight size={14} className="ml-auto" />
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-800">
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          {(['manual', 'auto'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); resetAll(); }}
              className="px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200"
              style={{
                background: mode === m ? '#1e40af' : 'transparent',
                color: mode === m ? '#fff' : '#64748b',
              }}
            >
              {m === 'manual' ? 'MANUAL' : 'SIMULATE'}
            </button>
          ))}
        </div>
        {mode === 'auto' && (
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(scenarios) as ScenarioKey[]).map(k => (
              <button
                key={k}
                onClick={() => { setActiveScenario(k); resetAll(); setSimStep(-1); }}
                className="px-3 py-1 text-xs rounded-md border transition-all duration-150 font-medium"
                style={{
                  background: activeScenario === k ? '#1e293b' : 'transparent',
                  borderColor: activeScenario === k ? '#38bdf8' : '#334155',
                  color: activeScenario === k ? '#38bdf8' : '#64748b',
                }}
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr_300px] gap-0 overflow-hidden">

        {/* Left: Controls */}
        <div className="border-r border-slate-800 p-5 flex flex-col gap-5 overflow-y-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Patient Vitals</p>
            <div className="flex flex-col gap-5">
              <VitalSlider label="Temperature" unit="°C" value={vitals.temp} min={34} max={42} step={0.1}
                onChange={setVital('temp')} color={vitalColor('temp', vitals.temp)} />
              <VitalSlider label="Blood Pressure (MAP)" unit="mmHg" value={vitals.bp} min={50} max={150} step={1}
                onChange={setVital('bp')} color={vitalColor('bp', vitals.bp)} />
              <VitalSlider label="Heart Rate" unit="bpm" value={vitals.hr} min={40} max={180} step={1}
                onChange={setVital('hr')} color={vitalColor('hr', vitals.hr)} />
              <VitalSlider label="SpO₂" unit="%" value={vitals.spo2} min={70} max={100} step={1}
                onChange={setVital('spo2')} color={vitalColor('spo2', vitals.spo2)} />
              <VitalSlider label="Resp. Rate" unit="/min" value={vitals.rr} min={8} max={48} step={1}
                onChange={setVital('rr')} color={vitalColor('rr', vitals.rr)} />
              <VitalSlider label="Lactate" unit="mmol/L" value={vitals.lac} min={0.5} max={12} step={0.1}
                onChange={setVital('lac')} color={vitalColor('lac', vitals.lac)} />
              <VitalSlider label="WBC" unit="×10³/µL" value={vitals.wbc} min={1} max={30} step={0.5}
                onChange={setVital('wbc')} color={vitalColor('wbc', vitals.wbc)} />
            </div>
          </div>

          {mode === 'auto' && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-1">{scenarios[activeScenario].desc}</p>
              {simStep >= 0 && (
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= simStep ? color : '#1e293b' }}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={isPlaying ? stopSim : startSim}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200"
                  style={{ background: isPlaying ? '#7f1d1d' : '#166534', color: '#fff', border: `1px solid ${isPlaying ? '#ef444444' : '#22c55e44'}` }}
                >
                  {isPlaying ? <><Square size={12} /> STOP</> : <><Play size={12} /> RUN</>}
                </button>
                <button
                  onClick={resetAll}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center: Body + Gauge */}
        <div className="flex flex-col items-center justify-center gap-6 p-6 border-r border-slate-800" style={{ background: '#0d1520' }}>
          <RiskGauge score={result.score} level={result.level} />
          <BodyFigure level={result.level} hr={vitals.hr} />
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs text-slate-500">SIRS Criteria</p>
              <p className="text-lg font-bold font-mono" style={{ color: result.sirsCount >= 2 ? color : '#64748b' }}>
                {result.sirsCount}<span className="text-xs text-slate-600">/4</span>
              </p>
            </div>
            <div className="w-px bg-slate-800" />
            <div>
              <p className="text-xs text-slate-500">Shock Index</p>
              <p className="text-lg font-bold font-mono" style={{ color: result.shockIndex >= 1.0 ? color : '#64748b' }}>
                {result.shockIndex.toFixed(2)}
              </p>
            </div>
            <div className="w-px bg-slate-800" />
            <div>
              <p className="text-xs text-slate-500">SOFA Total</p>
              <p className="text-lg font-bold font-mono" style={{ color: result.sofa.total >= 4 ? color : '#64748b' }}>
                {result.sofa.total}<span className="text-xs text-slate-600">/24</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Vital Overview</p>
            <div className="grid grid-cols-2 gap-2">
              <VitalCard label="Temp" value={vitals.temp.toFixed(1)} unit="°C" color={vitalColor('temp', vitals.temp)} />
              <VitalCard label="MAP" value={vitals.bp} unit="mmHg" color={vitalColor('bp', vitals.bp)} />
              <VitalCard label="HR" value={vitals.hr} unit="bpm" color={vitalColor('hr', vitals.hr)} />
              <VitalCard label="SpO₂" value={vitals.spo2} unit="%" color={vitalColor('spo2', vitals.spo2)} />
              <VitalCard label="RR" value={vitals.rr} unit="/min" color={vitalColor('rr', vitals.rr)} />
              <VitalCard label="Lactate" value={vitals.lac.toFixed(1)} unit="mmol/L" color={vitalColor('lac', vitals.lac)} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <SOFABars sofa={result.sofa} level={result.level} />
          </div>

          <div className="border-t border-slate-800 pt-4">
            <RiskTimeline history={history} level={result.level} />
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Model Basis</p>
            <div className="flex flex-wrap gap-1.5">
              {['LightGBM', 'SIRS', 'SOFA', 'Shock Index', 'Lactate'].map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-slate-700 text-slate-500 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
