import type { RefObject } from "react";

/**
 * A flowing bundle of light ribbons that sits behind a section's content,
 * giving the liquid-glass panels something bright to refract.
 * Pure SVG + CSS: no WebGL, cheap to render, and static under reduced motion.
 */

type Variant = "rise" | "fall" | "arc";

const STRANDS = 16;

// Each variant: start, two control points, end (viewBox 1600 x 900).
// Exported so other parts (the project cards riding the lines) can follow them.
export const curves: Record<Variant, number[]> = {
  rise: [-150, 760, 420, 520, 900, 900, 1750, 330],
  fall: [-150, 260, 520, 620, 1050, 180, 1750, 640],
  arc: [-150, 620, 500, 260, 1100, 980, 1750, 420],
};

function strandPath(base: number[], i: number) {
  const t = i / (STRANDS - 1) - 0.5; // -0.5 .. 0.5
  // Strands pinch together at the start and fan open toward the end.
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = base;
  return `M${x0} ${y0 + t * 14} C${c1x} ${c1y + t * 70} ${c2x} ${c2y + t * 170} ${x1} ${y1 + t * 260}`;
}

export default function LightSweep({
  variant = "rise",
  className = "",
  sweepRef,
}: {
  variant?: Variant;
  className?: string;
  sweepRef?: RefObject<HTMLDivElement>;
}) {
  const base = curves[variant];
  const core = strandPath(base, (STRANDS - 1) / 2);
  const id = `sweep-${variant}`;
  return (
    <div ref={sweepRef} className={`light-sweep ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f4d29a" stopOpacity="0" />
            <stop offset="0.3" stopColor="#f2c98a" stopOpacity="0.9" />
            <stop offset="0.65" stopColor="#e7b871" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6eade0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-blue`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#6eade0" stopOpacity="0" />
            <stop offset="0.45" stopColor="#8cc4ee" stopOpacity="0.7" />
            <stop offset="1" stopColor="#f2c98a" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-wide`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
          <filter id={`${id}-soft`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Broad atmospheric bloom under the ribbon. */}
        <path
          d={core}
          stroke={`url(#${id}-gold)`}
          strokeWidth="150"
          fill="none"
          opacity="0.32"
          filter={`url(#${id}-wide)`}
        />
        <g className="light-sweep__bundle">
          {/* Hot core. */}
          <path
            d={core}
            stroke={`url(#${id}-gold)`}
            strokeWidth="16"
            fill="none"
            opacity="0.7"
            filter={`url(#${id}-soft)`}
          />
          {/* Fine strands, like light through silk. */}
          {Array.from({ length: STRANDS }, (_, i) => (
            <path
              key={i}
              d={strandPath(base, i)}
              stroke={`url(#${id}-${i % 4 === 3 ? "blue" : "gold"})`}
              strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
              fill="none"
              opacity={0.25 + 0.5 * (1 - Math.abs(i / (STRANDS - 1) - 0.5) * 2)}
            />
          ))}
          {/* A glint travelling along the core. */}
          <path
            className="light-sweep__glint"
            d={core}
            stroke="#fff4dd"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            pathLength={1000}
            filter={`url(#${id}-soft)`}
          />
        </g>
      </svg>
    </div>
  );
}
