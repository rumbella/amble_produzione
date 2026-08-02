import React from 'react';

export interface LongArrowLeftProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const LongArrowLeft: React.FC<LongArrowLeftProps> = ({ 
  size = 24, 
  strokeWidth = 1.5, 
  className = "" 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size * 1.6} 
    height={size} 
    viewBox="0 0 38 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M36 12H4" />
    <path d="M11 5L4 12l7 7" />
  </svg>
);

export default LongArrowLeft;
