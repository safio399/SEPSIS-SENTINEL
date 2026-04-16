export interface Vitals {
  temp: number;
  bp: number;
  hr: number;
  spo2: number;
  rr: number;
  lac: number;
  wbc: number;
}

export interface SOFAScores {
  resp: number;
  coag: number;
  liver: number;
  cardio: number;
  renal: number;
  cns: number;
  total: number;
}

export interface RiskResult {
  score: number;
  level: 'safe' | 'warn' | 'elevated' | 'critical';
  sofa: SOFAScores;
  sirsCount: number;
  shockIndex: number;
}

export interface SimScenario {
  desc: string;
  steps: Vitals[];
}

export type ScenarioKey = 'septic' | 'recovery' | 'stable' | 'mixed';
