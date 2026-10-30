// Placeholder terrain until public/images/hero/ground.png exists: blocky
// Minecraft columns on the left that flatten into a smooth Roblox hill.
const BLOCK = 40;
const WIDTH = 1600;
const HEIGHT = 240;
const BLOCKY_END = 760;
// Column heights in blocks, left to right.
const COLUMNS = [3, 3, 4, 4, 5, 4, 4, 3, 3, 4, 3, 3, 2, 3, 2, 2, 2, 2, 2];

export function TwoWorldsGround() {
  return (
    <svg
      className="two-worlds-ground"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="roblox-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ccf4f" />
          <stop offset="1" stopColor="#2f9a3a" />
        </linearGradient>
        <pattern id="roblox-studs" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="7" fill="#ffffff" fillOpacity="0.14" />
        </pattern>
      </defs>

      <path
        d={`M ${BLOCKY_END - BLOCK * 2} ${HEIGHT - BLOCK * 2}
            C 1000 ${HEIGHT - 110}, 1250 ${HEIGHT - 150}, ${WIDTH} ${HEIGHT - 120}
            L ${WIDTH} ${HEIGHT} L ${BLOCKY_END - BLOCK * 2} ${HEIGHT} Z`}
        fill="url(#roblox-hill)"
      />
      <path
        d={`M ${BLOCKY_END - BLOCK * 2} ${HEIGHT - BLOCK * 2}
            C 1000 ${HEIGHT - 110}, 1250 ${HEIGHT - 150}, ${WIDTH} ${HEIGHT - 120}
            L ${WIDTH} ${HEIGHT} L ${BLOCKY_END - BLOCK * 2} ${HEIGHT} Z`}
        fill="url(#roblox-studs)"
      />

      {COLUMNS.map((blocks, index) => {
        const x = index * BLOCK;
        const top = HEIGHT - blocks * BLOCK;
        return (
          <g key={index}>
            <rect x={x} y={top} width={BLOCK} height={blocks * BLOCK} fill="#86593a" />
            <rect x={x} y={top} width={BLOCK} height={BLOCK / 4} fill="#6ab03c" />
            <rect x={x} y={top + BLOCK / 4} width={BLOCK} height={BLOCK / 8} fill="#548f30" />
          </g>
        );
      })}
    </svg>
  );
}
