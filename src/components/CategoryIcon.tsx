import React from 'react';
import { Brain, Heart } from 'lucide-react';
import type { Category } from '../types';

// Professional, beautifully proportioned Flexed Arm / Biceps Icon (matching Lucide style)
export const ArmBicepsIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Clenched Fist & Knuckles */}
    <path d="M15.2 4.2a2.3 2.3 0 0 1 3.3 3.3l-1.5 1.5" />
    <path d="M17 5.5l1.5 1.5" />
    {/* Forearm & Outer Elbow */}
    <path d="M17 9l1 3.8c.4 2-.4 3.9-2.2 4.9l-2.3.9H5.5a1.5 1.5 0 0 1-1.5-1.5v-.5c0-2.4 1.4-4.2 3.8-4.7" />
    {/* Peaked Biceps Muscle Curve */}
    <path d="M7.8 11.9c.5-2.6 2.1-4.7 4.7-4.7 2.1 0 3.6 1 4.5 2.6" />
    {/* Inner Muscle Definition */}
    <path d="M11.8 11.5c1 .9 2.2 1.1 3.4.7" />
  </svg>
);

interface CategoryIconProps {
  category: Category;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  className = "w-6 h-6", 
  size = 24 
}) => {
  switch (category) {
    case 'body':
      return <ArmBicepsIcon className={className} size={size} />;
    case 'mind':
      return <Brain className={className} size={size} strokeWidth={2.3} />;
    case 'soul':
      return <Heart className={className} size={size} fill="currentColor" strokeWidth={2} />;
  }
};
