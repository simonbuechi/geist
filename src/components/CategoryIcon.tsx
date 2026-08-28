import React from 'react';
import { Brain, Heart } from 'lucide-react';
import type { Category } from '../types';

// Exact Arm / Muscle icon matching Flaticon 5531136 with currentColor support
export const ArmBicepsIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => {
  const iconUrl = `${import.meta.env.BASE_URL}arm_flaticon.png`;

  return (
    <span 
      className={`inline-block bg-current shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${iconUrl})`,
        WebkitMaskImage: `url(${iconUrl})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

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
      return <Brain className={className} size={size} strokeWidth={2.4} />;
    case 'soul':
      return <Heart className={className} size={size} fill="currentColor" strokeWidth={2} />;
  }
};
