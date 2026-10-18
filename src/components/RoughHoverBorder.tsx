import React, { useRef, useEffect } from 'react';
import { annotate } from '../lib/rough-notation';
import type { RoughAnnotation } from '../lib/rough-notation';
import { useTheme } from '../context/ThemeContext';

export interface RoughHoverBorderProps {
  active: boolean;
  color?: string;
  darkColor?: string;
  strokeWidth?: number;
  padding?: number | [number, number] | [number, number, number, number];
  animationDuration?: number;
  iterations?: number;
}

/**
 * Draws an animated hand-drawn circle/oval border around its parent button using rough-notation
 * when `active` (hovered) is true.
 */
export const RoughHoverBorder: React.FC<RoughHoverBorderProps> = ({
  active,
  color = '#7A5C43',
  darkColor = '#DFC4A4',
  strokeWidth = 1.6,
  padding = 2,
  animationDuration = 650,
  iterations = 2,
}) => {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  const strokeColor = theme === 'dark' ? darkColor : color;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (annotationRef.current) {
      annotationRef.current.remove();
    }

    const ann = annotate(svg as unknown as HTMLElement, {
      type: 'circle',
      color: strokeColor,
      strokeWidth,
      padding,
      animationDuration,
      iterations,
      svg,
    });

    annotationRef.current = ann;

    if (active) {
      ann.show();
    }

    return () => {
      ann.remove();
      annotationRef.current = null;
    };
  }, [strokeColor, strokeWidth, animationDuration, iterations, JSON.stringify(padding)]);

  useEffect(() => {
    const ann = annotationRef.current;
    if (!ann) return;

    if (active) {
      ann.show();
    } else {
      ann.hide();
    }
  }, [active]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-testid="rough-hover-border"
      className="absolute inset-0 pointer-events-none overflow-visible w-full h-full z-20"
    />
  );
};
