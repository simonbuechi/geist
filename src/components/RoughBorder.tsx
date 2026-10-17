import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export interface RoughBorderProps {
  className?: string;
  borderRadius?: number;
  shape?: 'rectangle' | 'circle';
  color?: string;
  darkColor?: string;
  fill?: string;
  darkFill?: string;
  fillStyle?: 'solid' | 'hachure' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed';
  width?: number;
  roughness?: number;
  bowing?: number;
  opacity?: number;
  disableMultiStroke?: boolean;
}

export const RoughBorder: React.FC<RoughBorderProps> = ({
  className = '',
  borderRadius,
  shape,
  color,
  darkColor,
  fill,
  darkFill,
  fillStyle = 'solid',
  width = 1.5,
  roughness = 1.5,
  bowing = 1.2,
  opacity = 0.75,
  disableMultiStroke = false,
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

      const fillColor = theme === 'dark'
        ? (darkFill || fill)
        : fill;

      const drawOptions: any = {
        stroke: strokeColor,
        strokeWidth: width,
        roughness: roughness,
        bowing: bowing,
        disableMultiStroke,
      };

      if (fillColor) {
        drawOptions.fill = fillColor;
        drawOptions.fillStyle = fillStyle;
      }

      let borderNode: SVGGElement;
      if (shape === 'circle') {
        borderNode = rc.ellipse(w / 2, h / 2, Math.max(1, w - pad * 2), Math.max(1, h - pad * 2), drawOptions);
      } else if (borderRadius !== undefined && borderRadius > 0) {
        const rw = Math.max(1, w - pad * 2);
        const rh = Math.max(1, h - pad * 2);
        const r = Math.min(borderRadius, rw / 2, rh / 2);
        const x0 = pad;
        const y0 = pad;
        const x1 = pad + rw;
        const y1 = pad + rh;
        const d = `M ${x0 + r} ${y0} L ${x1 - r} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} L ${x1} ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} L ${x0 + r} ${y1} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} L ${x0} ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
        borderNode = rc.path(d, drawOptions);
      } else {
        borderNode = rc.rectangle(pad, pad, Math.max(1, w - pad * 2), Math.max(1, h - pad * 2), drawOptions);
      }
      svg.appendChild(borderNode);
    } catch (err) {
      console.warn('RoughBorder draw error:', err);
    }
  }, [dimensions, color, darkColor, fill, darkFill, fillStyle, width, roughness, bowing, opacity, theme, shape, borderRadius, disableMultiStroke]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${fill || darkFill ? 'z-0' : 'z-10'} ${className}`}
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
