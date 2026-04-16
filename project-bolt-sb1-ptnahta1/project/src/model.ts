import type { Vitals, SOFAScores, RiskResult } from './types';

export function computeSIRS(v: Vitals): number {
  let count = 0;
  if (v.temp > 38.3 || v.temp < 36.0) count++;
  if (v.hr > 90) count++;
  if (v.rr > 20) count++;
  if (v.wbc > 12 || v.wbc < 4) count++;
  return count;
}

export function computeSOFA(v: Vitals): SOFAScores {
  const resp = v.spo2 <= 85 ? 4 : v.spo2 <= 88 ? 3 : v.spo2 <= 92 ? 2 : v.spo2 <= 95 ? 1 : 0;
  const coag = v.wbc <= 4 ? 2 : v.lac >= 4 ? 1 : 0;
  const liver = v.lac >= 6 ? 3 : v.lac >= 4 ? 2 : v.lac >= 2.5 ? 1 : 0;
  const cardio = v.bp <= 65 ? 4 : v.bp <= 70 ? 3 : v.bp <= 80 ? 2 : v.bp <= 90 ? 1 : 0;
  const renal = v.lac >= 6 ? 3 : v.lac >= 4 ? 2 : v.lac >= 2 ? 1 : 0;
  const cns = v.bp <= 65 && v.hr >= 140 ? 3 : v.hr >= 130 && v.bp <= 80 ? 2 : v.hr >= 110 && v.bp <= 90 ? 1 : 0;
  return { resp, coag, liver, cardio, renal, cns, total: resp + coag + liver + cardio + renal + cns };
}

export function computeRisk(v: Vitals): RiskResult {
  let s = 0;

  if (v.temp >= 40.0) s += 18;
  else if (v.temp >= 39.0) s += 13;
  else if (v.temp >= 38.3) s += 8;
  else if (v.temp < 36.0) s += 15;

  if (v.bp <= 65) s += 32;
  else if (v.bp <= 75) s += 24;
  else if (v.bp <= 85) s += 16;
  else if (v.bp <= 100) s += 7;

  if (v.hr >= 140) s += 20;
  else if (v.hr >= 120) s += 14;
  else if (v.hr >= 110) s += 8;
  else if (v.hr >= 90) s += 3;

  if (v.spo2 <= 82) s += 25;
  else if (v.spo2 <= 88) s += 18;
  else if (v.spo2 <= 92) s += 10;
  else if (v.spo2 <= 95) s += 4;

  if (v.rr >= 36) s += 16;
  else if (v.rr >= 30) s += 11;
  else if (v.rr >= 24) s += 6;
  else if (v.rr >= 20) s += 2;

  if (v.lac >= 8) s += 30;
  else if (v.lac >= 6) s += 24;
  else if (v.lac >= 4) s += 18;
  else if (v.lac >= 2) s += 10;
  else if (v.lac >= 1.5) s += 4;

  if (v.wbc >= 22) s += 14;
  else if (v.wbc >= 16) s += 9;
  else if (v.wbc >= 12) s += 5;
  else if (v.wbc <= 4) s += 8;

  const si = v.hr / v.bp;
  if (si >= 1.2) s += 18;
  else if (si >= 1.0) s += 12;
  else if (si >= 0.8) s += 5;

  const sirsCount = computeSIRS(v);
  if (sirsCount >= 4) s += 12;
  else if (sirsCount >= 3) s += 7;
  else if (sirsCount >= 2) s += 2;

  const score = Math.min(Math.round(s), 99);
  const level = score >= 65 ? 'critical' : score >= 45 ? 'elevated' : score >= 25 ? 'warn' : 'safe';

  return {
    score,
    level,
    sofa: computeSOFA(v),
    sirsCount,
    shockIndex: parseFloat(si.toFixed(2)),
  };
}
