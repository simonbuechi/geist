import React, { useState } from 'react';
import { RoughBackground } from './RoughBackground';
import { RoughHoverBorder } from './RoughHoverBorder';

export interface PrimaryActionButtonProps {
  onClick: () => void;
  label: string;
  isReviewed?: boolean;
  className?: string;
  title?: string;
  'aria-label'?: string;
}

export const PrimaryActionButton: React.FC<PrimaryActionButtonProps> = ({
  onClick,
  label,
  isReviewed = false,
  className = '',
  title,
  'aria-label': ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const computedAriaLabel = ariaLabel || title || label;

  const fillColor = isReviewed ? '#4E7A52' : '#D7195F';
  const fillDarkColor = isReviewed ? '#426B46' : '#D7195F';
  const fillGradient: [string, string] | undefined = isReviewed ? undefined : ['#9123A6', '#D7195F'];
  const hoverStrokeColor = isReviewed ? '#365939' : '#9123A6';
  const hoverStrokeDarkColor = isReviewed ? '#89B08E' : '#D7195F';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      aria-label={computedAriaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-0 bg-transparent shadow-none text-white font-sans font-semibold text-sm sm:text-base flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7195F]/50 overflow-visible ${className}`}
    >
      {/* Borderless colored-pencil cross-hatch fill with #9123A6 -> #D7195F gradient */}
      <RoughBackground
        fill={fillColor}
        darkFill={fillDarkColor}
        fillGradient={fillGradient}
        darkFillGradient={fillGradient}
        stroke="transparent"
        darkStroke="transparent"
        strokeWidth={0}
        shape="rounded"
        borderRadius={999}
        fillStyle="cross-hatch"
        hachureAngle={-41}
        hachureGap={2.8}
        fillWeight={1.45}
        roughness={1.1}
        opacity={0.92}
        seed={isReviewed ? 88 : 42}
        className="rounded-full"
      />

      {/* Animated rough-notation circle/border on hover */}
      <RoughHoverBorder
        active={isHovered}
        color={hoverStrokeColor}
        darkColor={hoverStrokeDarkColor}
        strokeWidth={1.6}
        padding={2}
      />

      <span className="relative z-10 truncate leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {label}
      </span>
    </button>
  );
};
