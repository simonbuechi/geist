import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export interface RoughDividerProps {
  className?: string;
  color?: string;
  darkColor?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  opacity?: number;
  dashed?: boolean;
  seed?: number;
}

export const RoughDivider: React.FC<RoughDividerProps> = ({
  className = '',
  color = '#7A6A5E',
  darkColor = '#A89B8F',
  strokeWidth = 0.9,
  roughness = 1.1,
  bowing = 0.6,
  opacity = 0.32,
  dashed = false,
  seed = 17,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      if (w > 0) {
        setWidth((prev) => (prev === w ? prev : w));
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => updateWidth());
      ro.observe(container);
      return () => ro.disconnect();
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width === 0) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    try {
      const rc = rough.svg(svg);
      const strokeColor = theme === 'dark' ? darkColor : color;

      const options: Parameters<typeof rc.line>[4] = {
        stroke: strokeColor,
        strokeWidth,
        roughness,
        bowing,
        seed,
        disableMultiStroke: dashed,
        strokeLineDash: dashed ? [5, 5] : undefined,
      };

      const lineNode = rc.line(1, 3, Math.max(2, width - 1), 3, options);
      svg.appendChild(lineNode);
    } catch (err) {
      console.warn('RoughDivider draw error:', err);
    }
  }, [width, color, darkColor, strokeWidth, roughness, bowing, dashed, seed, theme]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[6px] pointer-events-none select-none overflow-visible ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width={width}
        height={6}
        className="w-full h-[6px] block overflow-visible"
      />
    </div>
  );
};
