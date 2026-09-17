import React, { useRef, useEffect, useState, useCallback } from 'react';
import { annotate } from '../lib/rough-notation';
import type { RoughAnnotation } from '../lib/rough-notation';
import { useTheme } from '../context/ThemeContext';

export interface RoughNotationHighlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  darkColor?: string;
  animationDuration?: number;
  iterations?: number;
  strokeWidth?: number;
  padding?: number | [number, number] | [number, number, number, number] | number[];
  trigger?: 'hover' | 'click' | 'both';
  show?: boolean; // Controlled display override
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export const RoughNotationHighlight: React.FC<RoughNotationHighlightProps> = ({
  children,
  className = '',
  color = 'rgba(215, 25, 95, 0.22)',
  darkColor = 'rgba(244, 114, 182, 0.32)',
  animationDuration = 450,
  iterations = 2,
  strokeWidth,
  padding = [2, 6, 2, 6],
  trigger = 'both',
  show: controlledShow,
  title,
  onClick,
}) => {
  const { theme } = useTheme();
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const activeColor = theme === 'dark' ? darkColor : color;

  // Determine if annotation should be visible
  const isVisible = controlledShow !== undefined
    ? controlledShow
    : (trigger === 'both' ? (isHovered || isPinned) : trigger === 'hover' ? isHovered : isPinned);

  // Initialize and update annotation instance
  useEffect(() => {
    const target = targetRef.current;
    const svg = svgRef.current;
    if (!target || !svg) return;

    if (annotationRef.current) {
      annotationRef.current.remove();
    }

    const ann = annotate(target, {
      type: 'highlight',
      color: activeColor,
      animationDuration,
      iterations,
      strokeWidth,
      padding,
      multiline: true,
      svg,
    });

    annotationRef.current = ann;

    if (isVisible) {
      ann.show();
    }

    return () => {
      ann.remove();
      annotationRef.current = null;
    };
  }, [activeColor, animationDuration, iterations, strokeWidth, JSON.stringify(padding)]);

  // React to visibility state changes
  useEffect(() => {
    const ann = annotationRef.current;
    if (!ann) return;

    if (isVisible) {
      ann.show();
    } else {
      ann.hide();
    }
  }, [isVisible]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsHovered(true);
    }
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsHovered(false);
    }
  }, [trigger]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (trigger === 'click' || trigger === 'both') {
      setIsPinned((prev) => !prev);
    }
    if (onClick) {
      onClick(e);
    }
  }, [trigger, onClick]);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={title}
    >
      {/* Background SVG highlighter annotation layer */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-0 overflow-visible w-full h-full"
      />
      {/* Interactive text / children content positioned in front */}
      <span ref={targetRef} className="relative z-10 inline-block">
        {children}
      </span>
    </span>
  );
};
