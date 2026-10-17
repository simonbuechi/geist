import React, { forwardRef } from 'react';
import { RoughBackground } from './RoughBackground';

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
    'bg-transparent text-[#4A3E36] dark:text-[#EDE5DD] border-0 shadow-none',
  ghost:
    'bg-transparent text-[#7D6E63] dark:text-[#BA9F83] border-0 shadow-none',
  subtle:
    'bg-transparent text-[#7D6E63] dark:text-[#BA9F83] border-0 shadow-none',
  primary:
    'bg-transparent text-[#D7195F] dark:text-[#F472B6] border-0 shadow-none',
  danger:
    'bg-transparent text-[#B83E32] dark:text-[#F3A59C] border-0 shadow-none',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-7 h-7 min-w-[28px] min-h-[28px] p-1 text-xs',
  md: 'w-9 h-9 min-w-[36px] min-h-[36px] p-1.5 text-sm',
  lg: 'w-10 h-10 min-w-[40px] min-h-[40px] p-2 text-base',
};

const zigzagConfigs: Record<IconButtonVariant, { fill: string; darkFill: string; opacity: number; gap: number }> = {
  default: {
    fill: '#7A6A5E',
    darkFill: '#EDE5DD',
    opacity: 0.55,
    gap: 2.4,
  },
  ghost: {
    fill: '#7A6A5E',
    darkFill: '#EDE5DD',
    opacity: 0.35,
    gap: 2.4,
  },
  subtle: {
    fill: '#8C7D71',
    darkFill: '#BA9F83',
    opacity: 0.40,
    gap: 2.4,
  },
  primary: {
    fill: '#D7195F',
    darkFill: '#F472B6',
    opacity: 0.75,
    gap: 2.2,
  },
  danger: {
    fill: '#B83E32',
    darkFill: '#F3A59C',
    opacity: 0.55,
    gap: 2.3,
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
      fillWeight = 1.8,
      icon,
      children,
      className,
      disabled,
      title,
      'aria-label': ariaLabel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const computedAriaLabel = ariaLabel || title;
    const cfg = zigzagConfigs[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        title={title}
        aria-label={computedAriaLabel}
        className={cn(
          'group relative inline-flex items-center justify-center shrink-0 rounded-full transition-all duration-150 overflow-hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7195F]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#F5F2EB] dark:focus-visible:ring-offset-[#1C1815]',
          'active:scale-95 active:shadow-none select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Hand-drawn circular rough.js zigzag pattern fill */}
        <RoughBackground
          shape="circle"
          fillStyle="zigzag"
          fill={cfg.fill}
          darkFill={cfg.darkFill}
          hachureAngle={-41}
          hachureGap={cfg.gap}
          fillWeight={fillWeight}
          roughness={1.0}
          opacity={cfg.opacity}
          seed={variantSeeds[variant]}
          className="transition-opacity group-hover:opacity-80"
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
