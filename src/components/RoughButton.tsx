import React, { useState } from 'react';
import { RoughBackground } from './RoughBackground';
import { RoughHoverBorder } from './RoughHoverBorder';

export type RoughButtonVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost';

export type RoughButtonSize = 'sm' | 'md' | 'lg';

export interface RoughButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RoughButtonVariant;
  size?: RoughButtonSize;
  seed?: number;
  fillColor?: string;
  darkFillColor?: string;
  hoverBorderColor?: string;
  darkHoverBorderColor?: string;
}

const sizeClasses: Record<RoughButtonSize, string> = {
  sm: 'px-3.5 py-1 text-xs min-h-[32px]',
  md: 'px-4 py-1.5 text-xs sm:text-sm min-h-[36px]',
  lg: 'px-5 py-2 text-sm sm:text-base min-h-[40px]',
};

const variantConfigs: Record<
  RoughButtonVariant,
  {
    textClass: string;
    fill: string;
    darkFill: string;
    fillGradient?: [string, string];
    hoverStroke: string;
    darkHoverStroke: string;
    opacity: number;
    hoverOpacity: number;
    gap: number;
    seed: number;
  }
> = {
  default: {
    textClass: 'text-[#332B25] dark:text-[#EAE2D9]',
    fill: '#C8A986',
    darkFill: '#C8A986',
    hoverStroke: '#8A6A46',
    darkHoverStroke: '#DFC4A4',
    opacity: 0.48,
    hoverOpacity: 0.72,
    gap: 2.8,
    seed: 31,
  },
  primary: {
    textClass: 'text-[#FAF6F0] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]',
    fill: '#D7195F',
    darkFill: '#D7195F',
    fillGradient: ['#9123A6', '#D7195F'],
    hoverStroke: '#9123A6',
    darkHoverStroke: '#D7195F',
    opacity: 0.92,
    hoverOpacity: 1,
    gap: 2.8,
    seed: 33,
  },
  success: {
    textClass: 'text-[#FAF6F0] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]',
    fill: '#4E7A52',
    darkFill: '#426B46',
    hoverStroke: '#365939',
    darkHoverStroke: '#89B08E',
    opacity: 0.92,
    hoverOpacity: 1,
    gap: 2.8,
    seed: 35,
  },
  warning: {
    textClass: 'text-[#7A4E0D] dark:text-[#F2CF88]',
    fill: '#D4A048',
    darkFill: '#C89238',
    hoverStroke: '#9E6B18',
    darkHoverStroke: '#E2B467',
    opacity: 0.38,
    hoverOpacity: 0.62,
    gap: 3.0,
    seed: 37,
  },
  danger: {
    textClass: 'text-[#8C2F22] dark:text-[#F3A59C]',
    fill: '#C45343',
    darkFill: '#B84A39',
    hoverStroke: '#963626',
    darkHoverStroke: '#E58B7E',
    opacity: 0.38,
    hoverOpacity: 0.62,
    gap: 3.0,
    seed: 39,
  },
  ghost: {
    textClass: 'text-[#5C524B] dark:text-[#C5B9AE] hover:text-[#332B25] dark:hover:text-[#EAE2D9]',
    fill: '#D2B694',
    darkFill: '#C8A986',
    hoverStroke: '#967652',
    darkHoverStroke: '#D2B694',
    opacity: 0.24,
    hoverOpacity: 0.48,
    gap: 3.2,
    seed: 41,
  },
};

export const RoughButton: React.FC<RoughButtonProps> = ({
  variant = 'default',
  size = 'md',
  seed,
  fillColor,
  darkFillColor,
  hoverBorderColor,
  darkHoverBorderColor,
  className = '',
  disabled,
  children,
  type = 'button',
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cfg = variantConfigs[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
      className={`group relative rounded-full border-0 bg-transparent shadow-none font-sans font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45 disabled:pointer-events-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7195F]/50 overflow-visible ${sizeClasses[size]} ${cfg.textClass} ${className}`}
      {...props}
    >
      <RoughBackground
        fill={fillColor || cfg.fill}
        darkFill={darkFillColor || cfg.darkFill}
        fillGradient={fillColor ? undefined : cfg.fillGradient}
        darkFillGradient={darkFillColor ? undefined : cfg.fillGradient}
        stroke="transparent"
        darkStroke="transparent"
        strokeWidth={0}
        shape="rounded"
        borderRadius={999}
        fillStyle="cross-hatch"
        hachureAngle={-41}
        hachureGap={cfg.gap}
        fillWeight={1.35}
        roughness={1.1}
        opacity={cfg.opacity}
        seed={seed ?? cfg.seed}
        className="rounded-full"
      />

      <RoughHoverBorder
        active={isHovered && !disabled}
        color={hoverBorderColor || cfg.hoverStroke}
        darkColor={darkHoverBorderColor || cfg.darkHoverStroke}
        strokeWidth={1.5}
        padding={2}
      />

      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 leading-none">
        {children}
      </span>
    </button>
  );
};
