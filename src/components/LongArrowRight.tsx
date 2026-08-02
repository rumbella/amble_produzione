import React from 'react';

export interface LongArrowRightProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const LongArrowRight: React.FC<LongArrowRightProps> = ({ 
  size = 20, 
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
    <path d="M2 12h32" />
    <path d="M27 5l7 7-7 7" />
  </svg>
);

export default LongArrowRight;
