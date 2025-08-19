import React from 'react';

interface ComputeIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ComputeIcon({ className = "", width = 24, height = 24 }: ComputeIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 18 18"
      className={className}
    >
      <title>fx-blur</title>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" stroke="currentColor">
        <circle cx="6.5" cy="2" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="11.5" cy="2" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="16" cy="6.5" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="16" cy="11.5" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="11.5" cy="16" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="6.5" cy="16" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="2" cy="11.5" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="2" cy="6.5" r="1" fill="currentColor" data-stroke="none" stroke="none"></circle>
        <circle cx="6.5" cy="6.5" r="1.25"></circle>
        <circle cx="11.5" cy="6.5" r="1.25"></circle>
        <circle cx="6.5" cy="11.5" r="1.25"></circle>
        <circle cx="11.5" cy="11.5" r="1.25"></circle>
      </g>
    </svg>
  );
}
