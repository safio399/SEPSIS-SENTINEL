import React from 'react';

type RiskLevel = 'safe' | 'warn' | 'elevated' | 'critical';

interface BodyFigureProps {
  level: RiskLevel;
  hr: number;
}

const riskColor: Record<RiskLevel, string> = {
  safe: '#00ffa6',
  warn: '#eab308',
  elevated: '#f97316',
  critical: '#ef4444',
};

const statusLabel: Record<RiskLevel, string> = {
  safe: 'Stable',
  warn: 'Monitoring',
  elevated: 'Alert',
  critical: 'Critical',
};

// Head: ellipse cx=80 cy=25 rx=14 ry=18
// Face spans roughly x: 66–94, y: 7–43
// Eyes ~y=20, Mouth ~y=31, Eyebrows ~y=16

interface FacialFeatures {
  leftBrow: string;
  rightBrow: string;
  leftEye: { cx: number; cy: number };
  rightEye: { cx: number; cy: number };
  leftPupil?: { cx: number; cy: number };
  rightPupil?: { cx: number; cy: number };
  mouth: string;
  // optional extras
  sweatDrop?: boolean;
  angryLines?: boolean;
}

const getFacialFeatures = (level: RiskLevel): FacialFeatures => {
  switch (level) {
    case 'safe':
      return {
        // Relaxed arched brows
        leftBrow:  'M73 16 Q76 14.5 79 16',
        rightBrow: 'M81 16 Q84 14.5 87 16',
        // Open round eyes
        leftEye:  { cx: 76, cy: 22 },
        rightEye: { cx: 84, cy: 22 },
        leftPupil:  { cx: 76, cy: 22 },
        rightPupil: { cx: 84, cy: 22 },
        // Cheerful curve upward
        mouth: 'M73 29 Q80 35 87 29',
      };

    case 'warn':
      return {
        // Slightly furrowed inward
        leftBrow:  'M73 16 Q76 15 79 16.5',
        rightBrow: 'M87 16 Q84 15 81 16.5',
        // Slightly squinted — oval a bit smaller vertically
        leftEye:  { cx: 76, cy: 22 },
        rightEye: { cx: 84, cy: 22 },
        leftPupil:  { cx: 76, cy: 22 },
        rightPupil: { cx: 84, cy: 22 },
        // Flat / slightly tense mouth
        mouth: 'M74 30 Q80 29 86 30',
      };

    case 'elevated':
      return {
        // Angled down toward center — concerned
        leftBrow:  'M73 17.5 Q76 15.5 79 17',
        rightBrow: 'M87 17.5 Q84 15.5 81 17',
        // More squinted
        leftEye:  { cx: 76, cy: 22 },
        rightEye: { cx: 84, cy: 22 },
        leftPupil:  { cx: 76, cy: 22 },
        rightPupil: { cx: 84, cy: 22 },
        // Slight frown
        mouth: 'M74 31 Q80 27 86 31',
        sweatDrop: true,
      };

    case 'critical':
      return {
        // Sharp V-shaped angry brows
        leftBrow:  'M73 18 L76 15.5 L79 17.5',
        rightBrow: 'M87 18 L84 15.5 L81 17.5',
        // Very squinted / alarmed — thin slits
        leftEye:  { cx: 76, cy: 22 },
        rightEye: { cx: 84, cy: 22 },
        // Distressed open frown
        mouth: 'M74 33 Q80 27 86 33',
        angryLines: true,
      };
  }
};

// Eye sizes per risk level
const eyeSize: Record<RiskLevel, { rx: number; ry: number }> = {
  safe:     { rx: 2.8, ry: 3.2 },   // wide open
  warn:     { rx: 2.8, ry: 2.4 },   // slightly squinted
  elevated: { rx: 2.8, ry: 1.6 },   // more squinted
  critical: { rx: 2.8, ry: 0.9 },   // nearly shut / alarmed
};

const BodyFigure: React.FC<BodyFigureProps> = ({ level, hr }) => {
  const color = riskColor[level];
  const id = level;
  const features = getFacialFeatures(level);
  const { rx: eyeRx, ry: eyeRy } = eyeSize[level];

  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <style>{`
        @keyframes hologram-flicker {
          0%,100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        @keyframes scan-move {
          0% { transform: translateY(-120%); }
          100% { transform: translateY(120%); }
        }

        @keyframes pulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        @keyframes sweat-fall {
          0%   { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(6px); opacity: 0; }
        }

        .hologram {
          animation: hologram-flicker 2s infinite ease-in-out;
        }

        .scan {
          animation: scan-move 3s linear infinite;
        }

        .pulse {
          animation: pulse ${hr > 110 ? '0.6s' : '1s'} infinite ease-in-out;
          transform-origin: center;
        }

        .critical-glitch {
          animation: hologram-flicker 0.8s infinite;
        }

        .eye-blink {
          animation: blink 4s infinite ease-in-out;
          transform-origin: center;
        }

        .sweat {
          animation: sweat-fall 1.4s infinite ease-in;
        }
      `}</style>

      <svg
        className={`hologram ${level === 'critical' ? 'critical-glitch' : ''}`}
        width="160"
        height="300"
        viewBox="0 0 160 300"
      >
        <defs>
          <linearGradient id={`holo-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <filter id={`glow-${id}`}>
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Clip to head so expression stays inside */}
          <clipPath id={`head-clip-${id}`}>
            <ellipse cx="80" cy="25" rx="13.5" ry="17.5" />
          </clipPath>
        </defs>

        {/* Vertical scan lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={i * 8} y1="0"
            x2={i * 8} y2="300"
            stroke="#00f0ff"
            strokeWidth="0.3"
            opacity="0.15"
          />
        ))}

        {/* Moving scan beam */}
        <rect
          className="scan"
          x="0" y="0" width="160" height="40"
          fill={`url(#holo-${id})`}
          opacity="0.08"
        />

        {/* ── BODY OUTLINE ── */}
        <g
          fill="none"
          stroke={`url(#holo-${id})`}
          strokeWidth="1.2"
          filter={`url(#glow-${id})`}
          opacity="0.9"
        >
          <ellipse cx="80" cy="25" rx="14" ry="18" />
          <path d="M50 60 Q80 50 110 60 L105 150 Q80 165 55 150 Z" />
          <path d="M50 65 Q30 100 40 150" />
          <path d="M110 65 Q130 100 120 150" />
          <path d="M65 150 L60 240" />
          <path d="M95 150 L100 240" />
        </g>

        {/* ── FACIAL EXPRESSION (clipped to head) ── */}
        <g clipPath={`url(#head-clip-${id})`}>

          {/* Eyebrows */}
          <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d={features.leftBrow} />
            <path d={features.rightBrow} />
          </g>

          {/* Angry lines for critical — forehead crease marks */}
          {features.angryLines && (
            <g stroke={color} strokeWidth="0.7" opacity="0.7" strokeLinecap="round">
              <line x1="78" y1="19" x2="77" y2="21" />
              <line x1="82" y1="19" x2="83" y2="21" />
            </g>
          )}

          {/* Eyes (whites / sclera) */}
          <g className="eye-blink">
            <ellipse
              cx={features.leftEye.cx} cy={features.leftEye.cy}
              rx={eyeRx} ry={eyeRy}
              fill="rgba(255,255,255,0.12)"
              stroke={color} strokeWidth="0.8"
            />
            <ellipse
              cx={features.rightEye.cx} cy={features.rightEye.cy}
              rx={eyeRx} ry={eyeRy}
              fill="rgba(255,255,255,0.12)"
              stroke={color} strokeWidth="0.8"
            />
          </g>

          {/* Pupils (only for safe/warn/elevated—critical has slit eyes) */}
          {features.leftPupil && (
            <g fill={color} opacity="0.9">
              <circle cx={features.leftPupil.cx}  cy={features.leftPupil.cy}  r="1.1" />
              <circle cx={features.rightPupil!.cx} cy={features.rightPupil!.cy} r="1.1" />
            </g>
          )}

          {/* Mouth */}
          <path
            d={features.mouth}
            stroke={color}
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Sweat drop (elevated stress) */}
          {features.sweatDrop && (
            <g className="sweat">
              <ellipse cx="91" cy="19" rx="1.2" ry="1.8" fill={color} opacity="0.7" />
            </g>
          )}
        </g>

        {/* ── ORGANS ── */}


        {/* Heart */}
        <path
          className="pulse"
          d="M80 100 Q75 95 70 100 Q70 110 80 115 Q90 110 90 100 Q85 95 80 100Z"
          stroke="#ff4d6d" strokeWidth="1" fill="none"
        />

        {/* Lungs */}
        <ellipse cx="70" cy="90" rx="6" ry="10"
          stroke="#00ffa6" strokeWidth="0.6" fill="none" opacity="0.6"/>
        <ellipse cx="90" cy="90" rx="6" ry="10"
          stroke="#00ffa6" strokeWidth="0.6" fill="none" opacity="0.6"/>

        {/* Spine */}
        <line x1="80" y1="50" x2="80" y2="150"
          stroke="#00f0ff" strokeWidth="0.5" opacity="0.5"/>
      </svg>

      <div
        className="mt-2 text-xs font-semibold"
        style={{ color, letterSpacing: '0.15em' }}
      >
        {statusLabel[level].toUpperCase()}
      </div>
    </div>
  );
};

export default BodyFigure;
