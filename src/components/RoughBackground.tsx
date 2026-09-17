import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export interface RoughBackgroundProps {
  className?: string;
  fill?: string;
  fillStyle?: 'hachure' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed';
  hachureAngle?: number;
  hachureGap?: number;
  fillWeight?: number;
  roughness?: number;
  bowing?: number;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  opacity?: number;
  drawBottomLine?: boolean;
  bottomLineColor?: string;
  drawBorder?: boolean;
  borderColor?: string;
}

export const RoughBackground: React.FC<RoughBackgroundProps> = ({
  className = '',
  fill = '#D7195F',
  fillStyle = 'hachure',
  hachureAngle = -41,
  hachureGap = 3.5,
  fillWeight = 1.1,
  roughness = 1.2,
  bowing = 1.0,
  stroke = 'transparent',
  strokeWidth = 1,
  opacity = 0.25,
  drawBottomLine = false,
  bottomLineColor = '#574A40',
  drawBorder = false,
  borderColor = '#574A40',
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

    // Clear previous children
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    try {
      const rc = rough.svg(svg);
      const w = dimensions.width;
      const h = dimensions.height;

      const strokeColor = drawBorder ? borderColor : stroke;
      const effectiveStrokeWidth = drawBorder ? strokeWidth : (stroke === 'transparent' ? 0 : strokeWidth);
      const effectiveFill = (fill === 'none' || fill === 'transparent') ? undefined : fill;

      const rectNode = rc.rectangle(1, 1, Math.max(1, w - 2), Math.max(1, h - 2), {
        fill: effectiveFill,
        fillStyle,
        hachureAngle,
        hachureGap,
        fillWeight,
        roughness,
        bowing: 0,
        stroke: strokeColor,
        strokeWidth: effectiveStrokeWidth,
      });
      svg.appendChild(rectNode);

      // Optionally draw a hand-sketched pencil separator line at the bottom
      if (drawBottomLine) {
        const lineNode = rc.line(0, h - 1, w, h - 1, {
          stroke: bottomLineColor,
          strokeWidth: 1.0,
          roughness: 1.2,
          bowing: 0.6,
        });
        svg.appendChild(lineNode);
      }
    } catch (err) {
      console.warn('Rough.js draw error:', err);
    }
  }, [dimensions, fill, fillStyle, hachureAngle, hachureGap, fillWeight, roughness, bowing, stroke, strokeWidth, opacity, drawBottomLine, bottomLineColor, drawBorder, borderColor, theme]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block"
      />
    </div>
  );
};
