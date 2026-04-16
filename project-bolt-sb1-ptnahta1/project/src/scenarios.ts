import type { SimScenario, ScenarioKey } from './types';

export const scenarios: Record<ScenarioKey, SimScenario> = {
  septic: {
    desc: 'Septic shock progression — rapid deterioration with hypotension and hyperlactatemia',
    steps: [
      { temp: 37.3, bp: 116, hr: 84, spo2: 98, rr: 16, lac: 1.1, wbc: 9.0 },
      { temp: 38.2, bp: 108, hr: 96, spo2: 97, rr: 18, lac: 1.6, wbc: 12.4 },
      { temp: 38.8, bp: 96,  hr: 108, spo2: 95, rr: 22, lac: 2.2, wbc: 15.0 },
      { temp: 39.4, bp: 84,  hr: 118, spo2: 92, rr: 26, lac: 3.4, wbc: 18.2 },
      { temp: 39.8, bp: 74,  hr: 128, spo2: 89, rr: 30, lac: 5.1, wbc: 20.5 },
      { temp: 40.2, bp: 64,  hr: 142, spo2: 84, rr: 36, lac: 7.8, wbc: 22.8 },
    ],
  },
  recovery: {
    desc: 'Post-antibiotic recovery — vitals stabilizing with improving lactate clearance',
    steps: [
      { temp: 39.6, bp: 70,  hr: 136, spo2: 86, rr: 32, lac: 6.8, wbc: 21.0 },
      { temp: 39.1, bp: 78,  hr: 124, spo2: 89, rr: 28, lac: 5.0, wbc: 19.2 },
      { temp: 38.6, bp: 86,  hr: 114, spo2: 92, rr: 24, lac: 3.6, wbc: 17.0 },
      { temp: 38.0, bp: 96,  hr: 104, spo2: 94, rr: 21, lac: 2.4, wbc: 14.5 },
      { temp: 37.5, bp: 108, hr: 94,  spo2: 96, rr: 18, lac: 1.6, wbc: 11.8 },
      { temp: 37.1, bp: 118, hr: 82,  spo2: 98, rr: 15, lac: 1.0, wbc: 9.2  },
    ],
  },
  stable: {
    desc: 'Stable localized infection — mild inflammation, no systemic compromise',
    steps: [
      { temp: 37.8, bp: 118, hr: 88, spo2: 97, rr: 18, lac: 1.3, wbc: 12.0 },
      { temp: 38.0, bp: 116, hr: 90, spo2: 97, rr: 19, lac: 1.4, wbc: 12.5 },
      { temp: 37.9, bp: 120, hr: 87, spo2: 98, rr: 17, lac: 1.2, wbc: 11.8 },
      { temp: 38.1, bp: 114, hr: 92, spo2: 96, rr: 20, lac: 1.5, wbc: 13.0 },
      { temp: 37.7, bp: 118, hr: 86, spo2: 97, rr: 17, lac: 1.2, wbc: 11.5 },
      { temp: 37.6, bp: 122, hr: 84, spo2: 98, rr: 16, lac: 1.1, wbc: 11.0 },
    ],
  },
  mixed: {
    desc: 'Biphasic response — initial deterioration followed by treatment-driven recovery',
    steps: [
      { temp: 37.4, bp: 112, hr: 88, spo2: 97, rr: 17, lac: 1.3, wbc: 10.5 },
      { temp: 38.5, bp: 98,  hr: 104, spo2: 93, rr: 23, lac: 2.8, wbc: 15.0 },
      { temp: 39.6, bp: 78,  hr: 122, spo2: 89, rr: 30, lac: 4.6, wbc: 19.0 },
      { temp: 39.2, bp: 84,  hr: 116, spo2: 91, rr: 26, lac: 3.8, wbc: 17.5 },
      { temp: 38.4, bp: 98,  hr: 102, spo2: 94, rr: 21, lac: 2.2, wbc: 13.8 },
      { temp: 37.6, bp: 112, hr: 88,  spo2: 97, rr: 17, lac: 1.3, wbc: 10.8 },
    ],
  },
};
