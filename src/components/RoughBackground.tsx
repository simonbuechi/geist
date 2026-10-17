import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export interface RoughBackgroundProps {
  className?: string;
  fill?: string;
  darkFill?: string;
  fillStyle?: 'hachure' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed' | 'solid';
  hachureAngle?: number;
  hachureGap?: number;
  fillWeight?: number;
  roughness?: number;
  bowing?: number;
  stroke?: string;
  darkStroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  shape?: 'rectangle' | 'circle' | 'rounded';
  opacity?: number;
  hoverOpacity?: number;
  drawBottomLine?: boolean;
  bottomLineColor?: string;
  darkBottomLineColor?: string;
  drawBorder?: boolean;
  borderColor?: string;
  darkBorderColor?: string;
  seed?: number;
}

export const RoughBackground: React.FC<RoughBackgroundProps> = ({
  className = '',
  fill = '#D7195F',
  darkFill,
  fillStyle = 'hachure',
  hachureAngle = -41,
  hachureGap = 3.5,
  fillWeight = 1.1,
  roughness = 1.2,
  bowing = 1.0,
  stroke = 'transparent',
  darkStroke,
  strokeWidth = 1,
  borderRadius,
  shape = 'rectangle',
  opacity = 0.25,
  hoverOpacity,
  drawBottomLine = false,
  bottomLineColor = '#7A6A5E',
  darkBottomLineColor = '#EDE5DD',
  drawBorder = false,
  borderColor = '#7A6A5E',
  darkBorderColor = '#EDE5DD',
  seed,
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

      const isDark = theme === 'dark';
      const rawStrokeColor = drawBorder
        ? (isDark ? (darkBorderColor || borderColor) : borderColor)
        : (isDark ? (darkStroke || stroke) : stroke);
      const strokeColor = rawStrokeColor || 'transparent';
      const effectiveStrokeWidth = drawBorder ? strokeWidth : (strokeColor === 'transparent' ? 0 : strokeWidth);

      const chosenFill = isDark ? (darkFill || fill) : fill;
      const effectiveFill = (chosenFill === 'none' || chosenFill === 'transparent') ? undefined : chosenFill;

      const rectOptions: Parameters<typeof rc.rectangle>[4] = {
        fill: effectiveFill,
        fillStyle,
        hachureAngle,
        hachureGap,
        fillWeight,
        roughness,
        bowing: 0,
        stroke: strokeColor,
        strokeWidth: effectiveStrokeWidth,
      };

      if (seed !== undefined) {
        rectOptions.seed = seed;
      }

      let shapeNode: SVGGElement;
      if (shape === 'circle') {
        shapeNode = rc.ellipse(w / 2, h / 2, Math.max(1, w - 2), Math.max(1, h - 2), rectOptions);
      } else if ((borderRadius !== undefined && borderRadius > 0) || shape === 'rounded') {
        const pad = 1;
        const rw = Math.max(1, w - pad * 2);
        const rh = Math.max(1, h - pad * 2);
        const r = Math.min(borderRadius ?? rh / 2, rw / 2, rh / 2);
        const x0 = pad;
        const y0 = pad;
        const x1 = pad + rw;
        const y1 = pad + rh;
        const d = `M ${x0 + r} ${y0} L ${x1 - r} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} L ${x1} ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} L ${x0 + r} ${y1} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} L ${x0} ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
        shapeNode = rc.path(d, rectOptions);
      } else {
        shapeNode = rc.rectangle(1, 1, Math.max(1, w - 2), Math.max(1, h - 2), rectOptions);
      }
      svg.appendChild(shapeNode);

      // Optionally draw a hand-sketched pencil separator line at the bottom
      if (drawBottomLine) {
        const lineStroke = isDark ? (darkBottomLineColor || bottomLineColor) : bottomLineColor;
        const lineOptions: Parameters<typeof rc.line>[4] = {
          stroke: lineStroke,
          strokeWidth: 1.0,
          roughness: 1.2,
          bowing: 0.6,
        };
        if (seed !== undefined) {
          lineOptions.seed = seed + 1;
        }
        const lineNode = rc.line(0, h - 1, w, h - 1, lineOptions);
        svg.appendChild(lineNode);
      }
    } catch (err) {
      console.warn('Rough.js draw error:', err);
    }
  }, [dimensions, fill, darkFill, fillStyle, hachureAngle, hachureGap, fillWeight, roughness, bowing, stroke, darkStroke, strokeWidth, opacity, drawBottomLine, bottomLineColor, darkBottomLineColor, drawBorder, borderColor, darkBorderColor, theme, seed, shape, borderRadius]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-150 opacity-[var(--rb-opacity)] group-hover:opacity-[var(--rb-hover-opacity)] ${className}`}
      style={{
        '--rb-opacity': opacity,
        '--rb-hover-opacity': hoverOpacity ?? opacity,
      } as React.CSSProperties}
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
