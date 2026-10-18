import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface RoughSparklesOverlayProps {
  active: boolean;
  onComplete?: () => void;
}

interface SparkleConfig {
  id: number;
  startX: number; // vw %
  startY: number; // vh %
  dx: number;     // px travel X
  dy: number;     // px travel Y
  size: number;   // px
  color: string;
  shape: 'star4' | 'burst' | 'diamond';
  delay: number;  // ms
  duration: number; // ms
  rotate: number; // deg
  seed: number;
}

const SPARKLE_COLORS = [
  '#9123A6',
  '#D7195F',
  '#C8A986',
  '#4E7A52',
  '#D4A048',
];

const SPARKLES: SparkleConfig[] = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.22;
  const ring = (i % 3) + 1; // 1 = inner, 2 = mid, 3 = outer
  const speed = 75 + ring * 65 + (i % 4) * 20;

  // Spread origin around center-top area where the review banner appears
  const originSpreadX = ((i * 37) % 50) - 25;
  const originSpreadY = ((i * 23) % 30) - 15;

  const shapes: SparkleConfig['shape'][] = ['star4', 'burst', 'diamond'];

  return {
    id: i,
    startX: 50 + originSpreadX,
    startY: 42 + originSpreadY,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed - 45, // slight upward lift
    size: 20 + (i % 4) * 7,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    shape: shapes[i % shapes.length],
    delay: (i % 6) * 45,
    duration: 1550 + (i % 5) * 160,
    rotate: (i % 2 === 0 ? 1 : -1) * (45 + (i % 4) * 30),
    seed: 900 + i * 7,
  };
});

const RoughSparkleItem: React.FC<{ config: SparkleConfig }> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);
    const s = config.size;
    const cx = s / 2;
    const cy = s / 2;
    const R = s * 0.44;
    const r = s * 0.14;

    if (config.shape === 'star4') {
      const node = rc.polygon(
        [
          [cx, cy - R],
          [cx + r, cy - r],
          [cx + R, cy],
          [cx + r, cy + r],
          [cx, cy + R],
          [cx - r, cy + r],
          [cx - R, cy],
          [cx - r, cy - r],
        ],
        {
          stroke: config.color,
          strokeWidth: 1.35,
          fill: config.color,
          fillStyle: 'hachure',
          hachureGap: 2.8,
          fillWeight: 1.0,
          roughness: 1.1,
          seed: config.seed,
        }
      );
      svg.appendChild(node);
    } else if (config.shape === 'diamond') {
      const node = rc.polygon(
        [
          [cx, cy - R * 0.9],
          [cx + R * 0.6, cy],
          [cx, cy + R * 0.9],
          [cx - R * 0.6, cy],
        ],
        {
          stroke: config.color,
          strokeWidth: 1.3,
          fill: config.color,
          fillStyle: 'cross-hatch',
          hachureGap: 3.0,
          fillWeight: 0.9,
          roughness: 1.15,
          seed: config.seed,
        }
      );
      svg.appendChild(node);
    } else {
      // Hand-drawn 4-line sparkle burst
      const d = R * 0.62;
      const lines = [
        rc.line(cx, cy - R, cx, cy + R, {
          stroke: config.color,
          strokeWidth: 1.5,
          roughness: 1.1,
          seed: config.seed,
        }),
        rc.line(cx - R, cy, cx + R, cy, {
          stroke: config.color,
          strokeWidth: 1.5,
          roughness: 1.1,
          seed: config.seed + 1,
        }),
        rc.line(cx - d, cy - d, cx + d, cy + d, {
          stroke: config.color,
          strokeWidth: 1.2,
          roughness: 1.1,
          seed: config.seed + 2,
        }),
        rc.line(cx - d, cy + d, cx + d, cy - d, {
          stroke: config.color,
          strokeWidth: 1.2,
          roughness: 1.1,
          seed: config.seed + 3,
        }),
      ];
      lines.forEach((l) => svg.appendChild(l));
    }
  }, [config]);

  return (
    <svg
      ref={svgRef}
      width={config.size}
      height={config.size}
      viewBox={`0 0 ${config.size} ${config.size}`}
      className="rough-sparkle-fly absolute pointer-events-none overflow-visible"
      style={
        {
          left: `${config.startX}%`,
          top: `${config.startY}%`,
          '--tx': `${config.dx}px`,
          '--ty': `${config.dy}px`,
          '--rot': `${config.rotate}deg`,
          animationDelay: `${config.delay}ms`,
          animationDuration: `${config.duration}ms`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
};

export const RoughSparklesOverlay: React.FC<RoughSparklesOverlayProps> = ({
  active,
  onComplete,
}) => {
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {SPARKLES.map((config) => (
        <RoughSparkleItem key={config.id} config={config} />
      ))}
    </div>
  );
};
