import React from 'react';

export interface FlamingoLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const FlamingoLogo: React.FC<FlamingoLogoProps> = ({ 
  className = "h-5 w-auto text-white", 
  ...props 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Headphone Band */}
    <path
      d="M38 34 A14 14 0 0 1 62 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />
    
    {/* Headphones Ear-pads */}
    <rect x="34" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <rect x="61" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <circle cx="36.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="63.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />

    {/* Elegant Flamingo head and beak */}
    <path
      d="M49 32 C43 32 40 37 40 43 C40 47 37 53 37 57 C37 60 38 61 39.5 58 C41 55 45 53 47 50 C49 47 50 43 50 43 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Elegant S-Neck */}
    <path
      d="M48 43 C52 43 55 49 53 58 C51 68 44 74 46 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />

    {/* Beautiful teardrop wing/body */}
    <path
      d="M46 84 C56 84 69 88 69 98 C69 109 56 113 46 113 C36 113 32 104 32 98 C32 88 36 84 46 84 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Slender legs */}
    <line x1="43" y1="112" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="112" x2="47" y2="152" stroke="currentColor" strokeWidth="2.5" />

    {/* Minimal feet */}
    <line x1="39" y1="152" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="152" x2="51" y2="152" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export default FlamingoLogo;
