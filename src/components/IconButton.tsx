import React, { forwardRef, useState } from 'react';
import { RoughBackground } from './RoughBackground';
import { RoughHoverBorder } from './RoughHoverBorder';

export type IconButtonVariant = 'default' | 'ghost' | 'subtle' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: React.ReactNode;
  fillWeight?: number;
  'aria-label'?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    'bg-transparent text-[#332B25] dark:text-[#EAE2D9] border-0 shadow-none',
  ghost:
    'bg-transparent text-[#6E6258] dark:text-[#A89B8F] hover:text-[#332B25] dark:hover:text-[#EAE2D9] border-0 shadow-none',
  subtle:
    'bg-transparent text-[#6E6258] dark:text-[#A89B8F] border-0 shadow-none',
  primary:
    'bg-transparent text-[#C46345] dark:text-[#E2876B] border-0 shadow-none',
  danger:
    'bg-transparent text-[#B54B3C] dark:text-[#E58B7E] border-0 shadow-none',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-7 h-7 min-w-[28px] min-h-[28px] p-1 text-xs',
  md: 'w-9 h-9 min-w-[36px] min-h-[36px] p-1.5 text-sm',
  lg: 'w-10 h-10 min-w-[40px] min-h-[40px] p-2 text-base',
};

const sketchConfigs: Record<
  IconButtonVariant,
  { fill: string; darkFill: string; hoverStroke: string; darkHoverStroke: string; opacity: number; gap: number }
> = {
  default: {
    fill: '#C8A986',
    darkFill: '#C8A986',
    hoverStroke: '#8A6A46',
    darkHoverStroke: '#DFC4A4',
    opacity: 0.55,
    gap: 2.6,
  },
  ghost: {
    fill: '#D2B694',
    darkFill: '#C8A986',
    hoverStroke: '#967652',
    darkHoverStroke: '#D2B694',
    opacity: 0.36,
    gap: 2.8,
  },
  subtle: {
    fill: '#CCAFA0',
    darkFill: '#C8A986',
    hoverStroke: '#967652',
    darkHoverStroke: '#D2B694',
    opacity: 0.45,
    gap: 2.7,
  },
  primary: {
    fill: '#C46345',
    darkFill: '#E2876B',
    hoverStroke: '#964229',
    darkHoverStroke: '#E2876B',
    opacity: 0.55,
    gap: 2.5,
  },
  danger: {
    fill: '#B54B3C',
    darkFill: '#E58B7E',
    hoverStroke: '#963628',
    darkHoverStroke: '#E58B7E',
    opacity: 0.45,
    gap: 2.6,
  },
};

const variantSeeds: Record<IconButtonVariant, number> = {
  default: 12,
  ghost: 14,
  subtle: 16,
  primary: 18,
  danger: 20,
};

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fillWeight = 1.4,
      icon,
      children,
      className,
      disabled,
      title,
      'aria-label': ariaLabel,
      type = 'button',
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const computedAriaLabel = ariaLabel || title;
    const cfg = sketchConfigs[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        title={title}
        aria-label={computedAriaLabel}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          onMouseLeave?.(e);
        }}
        className={cn(
          'group relative inline-flex items-center justify-center shrink-0 rounded-full overflow-visible',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C46345]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#F3EDE2] dark:focus-visible:ring-offset-[#191614]',
          'select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Borderless circular pencil shading */}
        <RoughBackground
          shape="circle"
          fillStyle="zigzag"
          fill={cfg.fill}
          darkFill={cfg.darkFill}
          stroke="transparent"
          darkStroke="transparent"
          strokeWidth={0}
          hachureAngle={-41}
          hachureGap={cfg.gap}
          fillWeight={fillWeight}
          roughness={1.1}
          opacity={cfg.opacity}
          seed={variantSeeds[variant]}
          className="rounded-full"
        />

        {/* Animated rough-notation circle drawn around the button on hover */}
        <RoughHoverBorder
          active={isHovered && !disabled}
          color={cfg.hoverStroke}
          darkColor={cfg.darkHoverStroke}
          strokeWidth={1.5}
          padding={1}
        />

        <span className="relative z-10 flex items-center justify-center">
          {icon}
          {children}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
