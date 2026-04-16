interface Props {
  label: string;
  value: string | number;
  unit: string;
  color: string;
  sub?: string;
}

export default function VitalCard({ label, value, unit, color, sub }: Props) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-0.5 transition-all duration-300"
      style={{ background: `${color}0d`, border: `1px solid ${color}22` }}
    >
      <span className="text-xs text-slate-500 tracking-wide uppercase font-medium">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold font-mono leading-none" style={{ color }}>{value}</span>
        <span className="text-xs text-slate-500 mb-0.5">{unit}</span>
      </div>
      {sub && <span className="text-xs text-slate-600 mt-0.5">{sub}</span>}
    </div>
  );
}
