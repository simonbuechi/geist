import React from 'react';

interface KgsLogoProps {
  size?: number;
  className?: string;
}

export const KgsLogo: React.FC<KgsLogoProps> = ({ 
  size = 34, 
  className = '' 
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      title="Körper Geist Seele"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-300 hover:rotate-6 hover:scale-105"
      >
        {/* Sketch background circle */}
        <path
          d="M32 6.5 C46.5 7, 57.2 17.5, 57.5 32 C57.8 46.5, 46.2 57.2, 32 57.5 C17.5 57.2, 6.5 46.2, 6.8 32 C7.1 17.5, 17.5 6.8, 32 6.5 Z"
          className="stroke-[#2D2621]/30 dark:stroke-[#EDE5DD]/30 fill-[#FDF7F4] dark:fill-[#2B231F]"
          strokeWidth="1.8"
        />
        
        {/* Hand-drawn Triquetra loops */}
        <path
          d="M32 13 C39 25, 47 37, 47 45 C47 52, 38 51, 32 43 C26 35, 25 23, 32 13 Z"
          className="stroke-[#D7195F] dark:stroke-[#F472B6]"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 41 C25 41, 39 39, 47 29 C53 21, 47 13, 37 17 C27 21, 21 33, 17 41 Z"
          className="stroke-[#C97A1E] dark:stroke-[#F2CF87]"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M47 41 C39 41, 25 39, 17 29 C11 21, 17 13, 27 17 C37 21, 43 33, 47 41 Z"
          className="stroke-[#B84D68] dark:stroke-[#E8A5B8]"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner sketch ring */}
        <circle
          cx="32"
          cy="32"
          r="9"
          className="stroke-[#2D2621]/40 dark:stroke-[#EDE5DD]/40"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
};
