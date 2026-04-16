import { useEffect, useRef } from 'react';

interface Props {
  history: number[];
  level: 'safe' | 'warn' | 'elevated' | 'critical';
}

const levelColor: Record<string, string> = {
  safe: '#22c55e',
  warn: '#eab308',
  elevated: '#f97316',
  critical: '#ef4444',
};

export default function RiskTimeline({ history, level }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = levelColor[level];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (history.length < 2) return;

    const pad = 8;
    const pts = history.map((v, i) => ({
      x: pad + (i / (history.length - 1)) * (W - pad * 2),
      y: H - pad - (v / 100) * (H - pad * 2),
    }));

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '55');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.lineTo(pts[pts.length - 1].x, H - pad);
    ctx.lineTo(pts[0].x, H - pad);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = color + '55';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [history, color]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Risk Timeline</span>
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full rounded-lg"
        style={{ background: '#0f172a' }}
      />
    </div>
  );
}
