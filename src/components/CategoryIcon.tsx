import React from 'react';
import type { Category } from '../types';

// 1. Bold, Solid, Massive Biceps / Muscle Arm for Body (Körper)
export const BicepsSolidIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Massive Flexed Biceps / Muscle Arm */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5 4.5C15.2 4.5 13.5 5.8 12.5 7.2C11.8 6.1 10.5 5.5 9.2 5.5C6.9 5.5 5 7.4 5 9.7C5 10.3 5.1 10.9 5.4 11.4C3.9 12.3 3 13.9 3 15.7C3 18.6 5.4 21 8.3 21H15.5C18.5 21 21 18.5 21 15.5C21 12.8 19.8 10.1 18.8 7.5C18.6 6.9 18.5 6.2 18.5 5.5C18.5 4.9 18.1 4.5 17.5 4.5ZM13.8 8.8C14.6 7.6 15.9 6.8 17.2 6.5C17.9 8.6 18.9 10.8 19 12.8C17.5 12.3 15.8 12.2 14.2 12.5C14 11.1 13.8 9.9 13.8 8.8ZM8.3 7.5C9.4 7.5 10.3 8.3 10.6 9.4C9.5 10.1 8.8 11.2 8.5 12.5C7.2 12.4 5.9 12.9 5.2 13.8C5.1 13.3 5 12.8 5 12.2C5 9.6 6.5 7.5 8.3 7.5Z"
    />
  </svg>
);

// 2. Bold, Solid, Massive Brain for Mind (Geist)
export const BrainSolidIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Solid Massive Brain with Hemispheres & Convolutions */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C10.5 2 9.2 2.6 8.3 3.6C7.2 3.2 5.9 3.6 5 4.6C3.9 5.9 3.8 7.8 4.7 9.2C4.1 10.1 3.9 11.3 4.3 12.4C4.7 13.6 5.8 14.4 7 14.7C7.1 15.9 7.9 17.1 9 17.7C9.4 18.8 10.4 19.6 11.6 19.8V21C11.6 21.6 12 22 12.5 22C13 22 13.4 21.6 13.4 21V19.8C14.6 19.6 15.6 18.8 16 17.7C17.1 17.1 17.9 15.9 18 14.7C19.2 14.4 20.3 13.6 20.7 12.4C21.1 11.3 20.9 10.1 20.3 9.2C21.2 7.8 21.1 5.9 20 4.6C19.1 3.6 17.8 3.2 16.7 3.6C15.8 2.6 14.5 2 13 2H12ZM9.5 6C8.7 6 8 6.7 8 7.5C8 8.3 8.7 9 9.5 9H11V5C10.5 5.3 10 5.6 9.5 6ZM13 5V9H14.5C15.3 9 16 8.3 16 7.5C16 6.7 15.3 6 14.5 6C14 5.6 13.5 5.3 13 5ZM6.5 11C6.5 9.9 7.4 9 8.5 9H11V13H8C7.2 13 6.5 12.1 6.5 11ZM13 13H16C16.8 13 17.5 12.1 17.5 11C17.5 9.9 16.6 9 15.5 9H13V13ZM8.5 15C8.5 14.2 9.2 13.5 10 13.5H11V17.5C9.6 17.5 8.5 16.4 8.5 15ZM13 17.5V13.5H14C14.8 13.5 15.5 14.2 15.5 15C15.5 16.4 14.4 17.5 13 17.5Z"
    />
  </svg>
);

// 3. Bold, Solid, Massive Heart for Soul (Seele)
export const HeartSolidIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Solid Chunky Heart */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
    />
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
      return <BicepsSolidIcon className={className} size={size} />;
    case 'mind':
      return <BrainSolidIcon className={className} size={size} />;
    case 'soul':
      return <HeartSolidIcon className={className} size={size} />;
  }
};
