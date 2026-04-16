import type { SOFAScores } from '../types';

interface Props {
  sofa: SOFAScores;
  level: 'safe' | 'warn' | 'elevated' | 'critical';
}

const organs = [
  { key: 'resp', label: 'Respiratory' },
  { key: 'coag', label: 'Coagulation' },
  { key: 'liver', label: 'Hepatic' },
  { key: 'cardio', label: 'Cardiovascular' },
  { key: 'renal', label: 'Renal' },
  { key: 'cns', label: 'Neurological' },
] as const;

function scoreColor(score: number): string {
  if (score >= 3) return '#ef4444';
  if (score >= 2) return '#f97316';
  if (score >= 1) return '#eab308';
  return '#22c55e';
}

export default function SOFABars({ sofa }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">SOFA Score</span>
        <span className="text-xs font-mono font-bold text-white">
          {sofa.total}<span className="text-slate-500">/24</span>
        </span>
      </div>
      {organs.map(({ key, label }) => {
        const val = sofa[key];
        const color = scoreColor(val);
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(val / 4) * 100}%`, background: color }}
              />
            </div>
            <span className="text-xs font-mono font-bold w-4 text-right" style={{ color }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}
