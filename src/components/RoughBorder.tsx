import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export interface RoughBorderProps {
  className?: string;
  borderRadius?: number;
  shape?: 'rectangle' | 'circle';
  color?: string;
  darkColor?: string;
  width?: number;
  roughness?: number;
  bowing?: number;
  opacity?: number;
}

export const RoughBorder: React.FC<RoughBorderProps> = ({
  className = '',
  borderRadius,
  shape,
  color,
  darkColor,
  width = 1.5,
  roughness = 1.5,
  bowing = 1.2,
  opacity = 0.75,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w > 0 && h > 0) {
        setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };

    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0 || dimensions.height === 0) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    try {
      const rc = rough.svg(svg);
      const w = dimensions.width;
      const h = dimensions.height;
      const pad = 2;

      const strokeColor = theme === 'dark' 
        ? (darkColor || color || '#EDE5DD') 
        : (color || '#6E5F54');

      const isCircle = shape === 'circle' || (borderRadius !== undefined && borderRadius >= 16);

      let borderNode: SVGGElement;
      if (isCircle) {
        borderNode = rc.ellipse(w / 2, h / 2, Math.max(1, w - pad * 2), Math.max(1, h - pad * 2), {
          stroke: strokeColor,
          strokeWidth: width,
          roughness: roughness,
          bowing: bowing,
        });
      } else {
        borderNode = rc.rectangle(pad, pad, Math.max(1, w - pad * 2), Math.max(1, h - pad * 2), {
          stroke: strokeColor,
          strokeWidth: width,
          roughness: roughness,
          bowing: bowing,
        });
      }
      svg.appendChild(borderNode);
    } catch (err) {
      console.warn('RoughBorder draw error:', err);
    }
  }, [dimensions, color, darkColor, width, roughness, bowing, opacity, theme, shape, borderRadius]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block overflow-visible"
      />
    </div>
  );
};
