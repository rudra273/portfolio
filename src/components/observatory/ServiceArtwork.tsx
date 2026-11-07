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
        <g>
          <circle cx="250" cy="250" r="24" fill="#d8edff" />
          <circle cx="250" cy="250" r="46" stroke="#8bbce8" opacity=".5" />
          {[82, 115, 147].map((radius, ring) => (
            <g key={radius}>
              <circle
                cx="250"
                cy="250"
                r={radius}
                stroke="#9ac7e6"
                opacity=".12"
              />
              {Array.from({ length: 30 }, (_, i) => {
                const angle = (i * Math.PI) / 15 + ring;
                return (
                  <circle
                    key={i}
                    cx={250 + Math.cos(angle) * radius}
                    cy={250 + Math.sin(angle) * radius}
                    r={i % 3 ? 1.4 : 2.8}
                    fill={i % 5 ? "#9ac7e6" : "#dec093"}
                  />
                );
              })}
            </g>
          ))}
        </g>
      ) : mode === 1 ? (
        <g transform="translate(250 250) rotate(-25)" stroke="#bad6e9">
          {[-1, 0, 1].map((i) => (
            <rect
              key={i}
              x={-76 + i * 20}
              y={-76 + i * 35}
              width="152"
              height="152"
              rx="10"
              fill={i === 0 ? "#d2b17a22" : "#9ac7e622"}
              strokeOpacity=".5"
            />
          ))}
        </g>
      ) : (
        <g>
          {[0, 60, 120].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 250 250)`}>
              <ellipse
                cx="250"
                cy="250"
                rx="158"
                ry="72"
                stroke={angle === 60 ? "#dec093" : "#9ac7e6"}
                opacity=".65"
              />
              <circle cx="408" cy="250" r="5" fill="#d5ecff" />
              <circle cx="92" cy="250" r="3" fill="#dec093" />
            </g>
          ))}
          <path
            d="M250 216 281 234 281 268 250 286 219 268 219 234Z"
            fill="#9ac7e633"
            stroke="#c9e3f4"
          />
        </g>
      )}
    </svg>
  );
}
