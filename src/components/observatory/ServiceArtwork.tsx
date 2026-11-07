/** Static artwork for reduced motion, initial loading, and unavailable WebGL. */
export default function ServiceArtwork({ mode }: { mode: number }) {
  return (
    <svg
      className="service-fallback"
      viewBox="0 0 500 500"
      fill="none"
      aria-hidden="true"
    >
      {mode === 0 ? (
        <g stroke="#9ac7e6" opacity=".65">
          {[85, 117, 147].map((radius) => (
            <g key={radius}>
              <circle cx="250" cy="250" r={radius} opacity=".4" />
              <ellipse cx="250" cy="250" rx={radius * 0.35} ry={radius} />
              <ellipse cx="250" cy="250" rx={radius * 0.72} ry={radius} />
            </g>
          ))}
        </g>
      ) : mode === 1 ? (
        <g transform="translate(250 250) rotate(-12)" stroke="#bad6e9">
          {[0.5, 0.75, 1].map((scale) => (
            <path
              key={scale}
              transform={`scale(${scale})`}
              opacity=".65"
              d="M-110 -100 H55 V65 H-110 Z M-55 -65 H110 V100 H-55 Z M-110 -100 -55 -65 M55 -100 110 -65 M55 65 110 100 M-110 65 -55 100"
            />
          ))}
        </g>
      ) : (
        <g stroke="#acd4ed" opacity=".8">
          <path d="M250 250 C110 65 40 345 145 345 C235 345 270 155 355 155 C460 155 390 435 250 250 C110 65 40 345 145 345" />
          {[
            [145, 170],
            [145, 330],
            [355, 170],
            [355, 330],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="12"
              fill="#122330"
              stroke="#e7c08c"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
