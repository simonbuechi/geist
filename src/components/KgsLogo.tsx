import React from 'react';

interface KgsLogoProps {
  size?: number;
  className?: string;
}

export const KgsLogo: React.FC<KgsLogoProps> = ({ 
  size = 40, 
  className = '' 
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-105 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.webp"
        alt="KGS Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to png if webp not supported
          (e.target as HTMLImageElement).src = '/logo.png';
        }}
      />
    </div>
  );
};
