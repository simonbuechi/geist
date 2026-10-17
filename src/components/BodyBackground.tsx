import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useTheme } from '../context/ThemeContext';

export const BodyBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

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
      const isDark = theme === 'dark';
      const w = dimensions.width;
      const h = dimensions.height;

      // Soft, lighter cross-hatch pattern with heightened organic roughness and uneven hand-drawn bowing
      const crossHatchNode = rc.rectangle(-12, -12, w + 24, h + 24, {
        fill: isDark ? '#EDE5DD' : '#7A6A5E',
        fillStyle: 'cross-hatch',
        hachureAngle: -45,
        hachureGap: 18,
        fillWeight: 0.9,
        roughness: 2.3,
        bowing: 1.3,
        stroke: 'transparent',
        strokeWidth: 0,
        seed: 42,
      });

      svg.appendChild(crossHatchNode);
    } catch (err) {
      console.warn('Error rendering rough body background:', err);
    }
  }, [dimensions, theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
      style={{
        opacity: theme === 'dark' ? 0.09 : 0.13,
      }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width || 1} ${dimensions.height || 1}`}
        className="w-full h-full block"
      />
    </div>
  );
};
