import { hashString, mulberry32 } from "@/lib/utils";

interface CoverArtProps {
  seed: string;
  color: string;
  className?: string;
  label?: string;
}

export function CoverArt({ seed, color, className, label }: CoverArtProps) {
  const rand = mulberry32(hashString(seed));
  const variant = Math.floor(rand() * 5);
  const uid = `cv-${hashString(seed).toString(36)}`;
  const cx = 200 + rand() * 400;
  const cy = 120 + rand() * 210;

  const shapes: React.ReactNode[] = [];

  if (variant === 0) {
    const rings = 6 + Math.floor(rand() * 4);
    for (let i = 1; i <= rings; i++) {
      shapes.push(
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i * (34 + rand() * 10)}
          fill="none"
          stroke={color}
          strokeWidth={i === rings ? 1.4 : 0.8}
          opacity={0.55 - i * 0.045}
        />,
      );
    }
    const angle = rand() * Math.PI * 2;
    shapes.push(
      <line
        key="sweep"
        x1={cx}
        y1={cy}
        x2={cx + Math.cos(angle) * 420}
        y2={cy + Math.sin(angle) * 420}
        stroke={color}
        strokeWidth={1.2}
        opacity={0.7}
      />,
    );
    for (let i = 0; i < 7; i++) {
      shapes.push(
        <circle
          key={`b${i}`}
          cx={cx + (rand() - 0.5) * 380}
          cy={cy + (rand() - 0.5) * 240}
          r={2 + rand() * 2.5}
          fill={color}
          opacity={0.5 + rand() * 0.5}
        />,
      );
    }
  } else if (variant === 1) {
    const pts: Array<[number, number]> = [];
    const n = 22 + Math.floor(rand() * 10);
    for (let i = 0; i < n; i++) pts.push([60 + rand() * 680, 40 + rand() * 370]);
    for (let i = 0; i < n; i++) {
      let best = -1;
      let bd = Infinity;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2;
        if (d < bd) {
          bd = d;
          best = j;
        }
      }
      if (best >= 0) {
        shapes.push(
          <line
            key={`l${i}`}
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={pts[best][0]}
            y2={pts[best][1]}
            stroke={color}
            strokeWidth={0.7}
            opacity={0.3}
          />,
        );
      }
      shapes.push(
        <circle key={`p${i}`} cx={pts[i][0]} cy={pts[i][1]} r={1.6 + rand() * 2.4} fill={color} opacity={0.85} />,
      );
    }
  } else if (variant === 2) {
    const bars = 46;
    const w = 800 / bars;
    for (let i = 0; i < bars; i++) {
      const h =
        40 +
        Math.abs(Math.sin(i * 0.32 + rand() * 6) * 120) +
        Math.abs(Math.sin(i * 0.11 + rand() * 3) * 70);
      shapes.push(
        <rect
          key={i}
          x={i * w + 2}
          y={225 - h / 2}
          width={w - 4}
          height={h}
          fill={color}
          opacity={0.16 + (h / 230) * 0.55}
        />,
      );
    }
    shapes.push(
      <line key="axis" x1={0} y1={225} x2={800} y2={225} stroke={color} strokeWidth={1} opacity={0.5} />,
    );
  } else if (variant === 3) {
    const orbits = 4 + Math.floor(rand() * 3);
    for (let i = 1; i <= orbits; i++) {
      const rx = i * (52 + rand() * 14);
      const ry = rx * (0.32 + rand() * 0.2);
      const rot = rand() * 180;
      shapes.push(
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
          opacity={0.5 - i * 0.06}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />,
      );
      const a = rand() * Math.PI * 2;
      shapes.push(
        <circle
          key={`m${i}`}
          cx={cx + Math.cos(a) * rx}
          cy={cy + Math.sin(a) * ry}
          r={2.5 + rand() * 3}
          fill={color}
          opacity={0.9}
        />,
      );
    }
    shapes.push(<circle key="star" cx={cx} cy={cy} r={7} fill={color} opacity={0.95} />);
  } else {
    const layers = 7 + Math.floor(rand() * 4);
    for (let i = layers; i >= 1; i--) {
      const s = i * (46 + rand() * 8);
      shapes.push(
        <rect
          key={i}
          x={cx - s / 2}
          y={cy - s / 2}
          width={s}
          height={s}
          fill="none"
          stroke={color}
          strokeWidth={0.9}
          opacity={0.5 - i * 0.04}
          transform={`rotate(${i * (4 + rand() * 6)} ${cx} ${cy})`}
        />,
      );
    }
  }

  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ?? `Generative artwork for ${seed}`}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0d13" />
          <stop offset="100%" stopColor="#06070a" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-vig`} cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill={`url(#${uid}-bg)`} />
      <rect width="800" height="450" fill={`url(#${uid}-glow)`} />

      <g stroke="#e9edf2" strokeOpacity="0.045" strokeWidth="1">
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 40} y1={0} x2={(i + 1) * 40} y2={450} />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i + 1) * 41} x2={800} y2={(i + 1) * 41} />
        ))}
      </g>

      {shapes}

      <rect width="800" height="450" fill={`url(#${uid}-vig)`} />

      <text
        x="24"
        y="428"
        fontFamily="monospace"
        fontSize="11"
        letterSpacing="3"
        fill="#e9edf2"
        opacity="0.4"
      >
        {(label ?? seed).toUpperCase().slice(0, 40)}
      </text>
      <circle cx="776" cy="24" r="3" fill={color} opacity="0.9" />
    </svg>
  );
}
