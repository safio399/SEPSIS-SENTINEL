interface Props {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  color: string;
}

export default function VitalSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  color,
}: Props) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col gap-1">
      {/* Label and value */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium tracking-wide">
          {label}
        </span>
        <span className="text-sm font-bold font-mono" style={{ color }}>
          {value}
          <span className="text-xs text-slate-500 font-normal ml-0.5">
            {unit}
          </span>
        </span>
      </div>

      {/* Slider container */}
      <div
        className="relative h-4 flex items-center"
        style={{ '--thumb-color': color } as React.CSSProperties}
      >
        {/* Background track */}
        <div className="absolute w-full h-1.5 rounded-full bg-slate-700 pointer-events-none" />

        {/* Filled track */}
        <div
          className="absolute h-1.5 rounded-full transition-all duration-150 pointer-events-none"
          style={{
            width: `${pct}%`,
            background: color,
          }}
        />

        {/* Functional range input with custom styled thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-thumb]:!appearance-none
            [&::-webkit-slider-thumb]:!block
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:!bg-[var(--thumb-color)]
            [&::-moz-range-thumb]:!appearance-none
            [&::-moz-range-thumb]:!block
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:border
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:!bg-[var(--thumb-color)]
            [&:focus]:outline-none"
        />
      </div>
    </div>
  );
}