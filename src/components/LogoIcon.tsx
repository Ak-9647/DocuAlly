import React from 'react';
import { cn } from '@/lib/utils';

type LogoIconProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'default' | 'gradient';
  className?: string;
};

export function LogoIcon({ 
  size = 'md', 
  color = '#4F46E5', 
  variant = 'default',
  className
}: LogoIconProps) {
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  const { width, height } = dimensions[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {variant === 'gradient' ? (
        <>
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="documentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F3F4F6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Shield with glow and gradient */}
          <path
            d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            fill="url(#shieldGradient)"
            filter="url(#glow)"
          />
          
          {/* Document icon with gradient */}
          <path
            d="M14.5 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V6.5L14.5 4Z"
            fill="url(#documentGradient)"
            stroke="#4F46E5"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 4V7H17"
            stroke="#4F46E5"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11H10"
            stroke="#4F46E5"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 15H10"
            stroke="#4F46E5"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 13H10"
            stroke="#4F46E5"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          {/* Shield outline */}
          <path
            d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            fill={`${color}20`}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Document icon inside */}
          <path
            d="M14.5 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V6.5L14.5 4Z"
            fill="white"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 4V7H17"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11H10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 15H10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 13H10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
