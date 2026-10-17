import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
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

  const fillColor = isReviewed ? '#4E7A52' : '#C46345';
  const fillDarkColor = isReviewed ? '#426B46' : '#B8583B';
  const strokeColor = isReviewed ? '#365939' : '#964229';
  const strokeDarkColor = isReviewed ? '#89B08E' : '#E2876B';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      aria-label={computedAriaLabel}
      className={`group relative px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-0 bg-[#3B3028]/10 dark:bg-black/20 shadow-pencil-sm hover:shadow-pencil hover:-translate-y-0.5 hover:brightness-105 text-white font-sans font-semibold text-sm sm:text-base active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C46345]/50 sketch-btn-press overflow-hidden ${className}`}
    >
      {/* Tactile hand-drawn colored-pencil cross-hatch fill and sketched pill contour */}
      <RoughBackground
        fill={fillColor}
        darkFill={fillDarkColor}
        stroke={strokeColor}
        darkStroke={strokeDarkColor}
        strokeWidth={1.3}
        shape="rounded"
        borderRadius={999}
        fillStyle="cross-hatch"
        hachureAngle={-41}
        hachureGap={3.0}
        fillWeight={1.4}
        roughness={1.1}
        opacity={0.9}
        hoverOpacity={1}
        seed={isReviewed ? 88 : 42}
      />

      {isReviewed ? (
        <CheckCircle2 className="w-4 h-4 stroke-[2.2] relative z-10 shrink-0 text-[#E8F3E8] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-transform duration-150 group-hover:scale-110" />
      ) : (
        <Sparkles className="w-4 h-4 stroke-[2.2] relative z-10 shrink-0 text-[#FDE8DF] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-transform duration-150 group-hover:scale-110" />
      )}

      <span className="relative z-10 truncate leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {label}
      </span>
    </button>
  );
};
