import React from 'react';
import type { Category, GoalStatus } from '../types';

// Asset imports for Körper
import korperBase from '../assets/icons/korper_base.png';
import korperAchieved from '../assets/icons/korper_achieved.png';
import korperPartial from '../assets/icons/korper_partial.png';
import korperNotAchieved from '../assets/icons/korper_not_achieved.png';

// Asset imports for Geist
import geistBase from '../assets/icons/geist_base.png';
import geistAchieved from '../assets/icons/geist_achieved.png';
import geistPartial from '../assets/icons/geist_partial.png';
import geistNotAchieved from '../assets/icons/geist_not_achieved.png';

// Asset imports for Seele
import seeleBase from '../assets/icons/seele_base.png';
import seeleAchieved from '../assets/icons/seele_achieved.png';
import seelePartial from '../assets/icons/seele_partial.png';
import seeleNotAchieved from '../assets/icons/seele_not_achieved.png';

export type CategoryIconVariant = 'base' | 'achieved' | 'partial' | 'not_achieved';

const categoryIcons: Record<Category, Record<CategoryIconVariant, string>> = {
  body: {
    base: korperBase,
    achieved: korperAchieved,
    partial: korperPartial,
    not_achieved: korperNotAchieved,
  },
  mind: {
    base: geistBase,
    achieved: geistAchieved,
    partial: geistPartial,
    not_achieved: geistNotAchieved,
  },
  soul: {
    base: seeleBase,
    achieved: seeleAchieved,
    partial: seelePartial,
    not_achieved: seeleNotAchieved,
  },
};

function statusToVariant(status?: GoalStatus): CategoryIconVariant {
  switch (status) {
    case 'good':
      return 'achieved';
    case 'partly':
      return 'partial';
    case 'poor':
      return 'not_achieved';
    default:
      return 'base';
  }
}

export interface CategoryIconProps {
  category: Category;
  variant?: CategoryIconVariant;
  status?: GoalStatus;
  size?: number;
  className?: string;
  alt?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  variant,
  status,
  size = 24, 
  className = '',
  alt
}) => {
  const resolvedVariant: CategoryIconVariant = variant ?? (status ? statusToVariant(status) : 'base');
  const src = categoryIcons[category]?.[resolvedVariant] ?? categoryIcons[category]?.base;
  const defaultAlt = `${category} ${resolvedVariant}`;

  return (
    <img
      src={src}
      alt={alt || defaultAlt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`inline-block select-none object-contain shrink-0 ${className}`}
      loading="lazy"
      draggable={false}
    />
  );
};

// Backward-compatible individual exports
export const BodyIcon: React.FC<{ className?: string; size?: number; variant?: CategoryIconVariant; status?: GoalStatus }> = (props) => (
  <CategoryIcon category="body" {...props} />
);

export const MindIcon: React.FC<{ className?: string; size?: number; variant?: CategoryIconVariant; status?: GoalStatus }> = (props) => (
  <CategoryIcon category="mind" {...props} />
);

export const SoulIcon: React.FC<{ className?: string; size?: number; variant?: CategoryIconVariant; status?: GoalStatus }> = (props) => (
  <CategoryIcon category="soul" {...props} />
);
