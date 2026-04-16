import { useEffect, useRef } from 'react';

interface Props {
  score: number;
  level: 'safe' | 'warn' | 'elevated' | 'critical';
}

const levelColor: Record<string, string> = {
  safe: '#22c55e',
  warn: '#eab308',
  elevated: '#f97316',
  critical: '#ef4444',
};

const levelLabel: Record<string, string> = {
  safe: 'LOW RISK',
  warn: 'MODERATE',
  elevated: 'HIGH RISK',
  critical: 'CRITICAL',
};

export default function RiskGauge({ score, level }: Props) {
  const animRef = useRef<number>(0);
  const currentRef = useRef<number>(0);
  const fillRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  const R = 60;
  const circumference = 2 * Math.PI * R;
  const arcLen = circumference * 0.75;
  const color = levelColor[level];

  useEffect(() => {
    const target = score;
    const start = currentRef.current;
    const startTime = performance.now();
    const duration = 600;

    cancelAnimationFrame(animRef.current);

    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const current = start + (target - start) * ease;
      currentRef.current = current;

      if (fillRef.current) {
        const offset = arcLen - (current / 100) * arcLen;
        fillRef.current.style.strokeDashoffset = String(offset);
        fillRef.current.style.stroke = color;
      }
      if (textRef.current) {
        textRef.current.textContent = String(Math.round(current));
      }

      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else currentRef.current = target;
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [score, color, arcLen]);

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle
          cx="80" cy="80" r={R}
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform="rotate(135 80 80)"
        />
        <circle
          ref={fillRef}
          cx="80" cy="80" r={R}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeDashoffset={String(arcLen)}
          strokeLinecap="round"
          transform="rotate(135 80 80)"
          style={{ transition: 'stroke 0.4s ease' }}
        />
        <text ref={textRef} x="80" y="76" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="monospace">
          {score}
        </text>
        <text x="80" y="96" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">
          RISK SCORE
        </text>
      </svg>
      <div
        className="text-xs font-bold tracking-widest px-3 py-1 rounded-full mt-1"
        style={{ color, border: `1px solid ${color}22`, background: `${color}11` }}
      >
        {levelLabel[level]}
      </div>
    </div>
  );
}
