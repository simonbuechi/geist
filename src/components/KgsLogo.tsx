import React from 'react';
import appLogo from '../assets/app_logo.png';

interface KgsLogoProps {
  size?: number;
  className?: string;
}

export const KgsLogo: React.FC<KgsLogoProps> = ({ 
  size = 36, 
  className = '' 
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      title="Körper Geist Seele"
    >
      <img
        src={appLogo}
        alt="Körper Geist Seele Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain dark:brightness-175 dark:contrast-90"
        draggable={false}
      />
    </div>
  );
};
