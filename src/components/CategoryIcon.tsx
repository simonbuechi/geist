import React from 'react';
import type { Category } from '../types';

export const BodyIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg 
    viewBox="0 0 50.463 50.463" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 select-none ${className}`}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M47.923,29.694c0.021-0.601-0.516-1.063-0.901-1.515c-0.676-2.733-2.016-5.864-3.961-8.971 C39.942,14.23,31.688,6.204,28.553,4.966c-0.158-0.062-0.299-0.097-0.429-0.126c-0.313-1.013-0.479-1.708-1.698-2.521 c-3.354-2.236-7.099-2.866-9.578-1.843c-2.481,1.023-3.859,6.687-1.19,8.625c2.546,1.857,7.583-1.888,9.195,0.509 c1.609,2.396,3.386,10.374,6.338,15.473c-0.746-0.102-1.514-0.156-2.307-0.156c-3.406,0-6.467,0.998-8.63,2.593 c-1.85-2.887-5.08-4.806-8.764-4.806c-3.82,0-7.141,2.064-8.95,5.13v22.619h4.879l1.042-1.849 c3.354-1.287,7.32-4.607,10.076-8.147C29.551,44.789,47.676,36.789,47.923,29.694z" />
  </svg>
);

export const MindIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg 
    viewBox="0 0 512 512" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 select-none ${className}`}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M475.606,295.503L434.2,207.722c0.109-2.625,0.203-5.25,0.203-7.906c0-110.344-89.469-199.813-199.828-199.813 S34.747,89.472,34.747,199.815c0,62.063,28.281,117.516,72.672,154.172v70.625c0,6.891,4.109,13.125,10.453,15.813l165.5,70.203 c5.297,2.25,11.375,1.703,16.172-1.469c4.813-3.188,7.703-8.563,7.703-14.313v-59.859c0-9.469,7.688-17.172,17.156-17.172h84.766 c9.484,0,17.156-7.688,17.156-17.156V349.05c0-6.578,3.766-12.578,9.672-15.453l31.578-15.328 C476.044,314.144,479.622,304.003,475.606,295.503z" />
  </svg>
);

export const SoulIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => (
  <svg 
    viewBox="0 0 16 16" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 select-none ${className}`}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" />
  </svg>
);

export interface CategoryIconProps {
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
      return <BodyIcon className={className} size={size} />;
    case 'mind':
      return <MindIcon className={className} size={size} />;
    case 'soul':
      return <SoulIcon className={className} size={size} />;
  }
};
