import React from 'react';
import { Dumbbell, Brain, Heart } from 'lucide-react';
import type { Category } from '../types';

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
      return <Dumbbell className={className} size={size} strokeWidth={2.4} />;
    case 'mind':
      return <Brain className={className} size={size} strokeWidth={2.4} />;
    case 'soul':
      return <Heart className={className} size={size} fill="currentColor" strokeWidth={2} />;
  }
};
