import React from 'react';
import { RoughBackground } from './RoughBackground';

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
  const computedAriaLabel = ariaLabel || title || label;

  const fillColor = isReviewed ? '#4D7A4A' : '#D7195F';
  const fillDarkColor = isReviewed ? '#3E6B3B' : '#C51756';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      aria-label={computedAriaLabel}
      className={`group relative px-6 py-2.5 sm:px-7 sm:py-3 rounded-full border-0 shadow-pencil-sm text-white font-hand font-bold text-lg sm:text-xl active:scale-95 transition-transform flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7195F]/50 sketch-btn-press overflow-hidden ${className}`}
    >
      {/* Tactile hand-drawn cross-hatch shading and rounded shape */}
      <RoughBackground
        fill={fillColor}
        darkFill={fillDarkColor}
        shape="rounded"
        borderRadius={999}
        fillStyle="cross-hatch"
        hachureAngle={-41}
        hachureGap={3.8}
        fillWeight={1.2}
        roughness={1.1}
        opacity={0.92}
        seed={isReviewed ? 88 : 42}
      />

      <span className="relative z-10 truncate leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        {label}
      </span>
    </button>
  );
};
