
import React, { useState } from "react";

interface LogoProps {
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ color = '#5D534A' }) => {
  const subColor = color === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : '#8D7B68';

  return (
    <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <style>
        {`
          .logo-font-main { font-family: 'Playfair Display', serif; font-weight: 400; transition: fill 0.3s ease-in-out; }
          .logo-font-sub { font-family: 'Roboto', sans-serif; font-weight: 300; transition: fill 0.3s ease-in-out; }
        `}
      </style>
      <text
        x="50%"
        y="18"
        textAnchor="middle"
        className="logo-font-main"
        fontSize="20"
        fill={color}
        letterSpacing="1"
      >
        TIWARI
      </text>
      <text
        x="50%"
        y="32"
        textAnchor="middle"
        className="logo-font-sub"
        fontSize="8"
        fill={subColor}
        letterSpacing="3"
      >
        ENTERPRISES
      </text>
    </svg>
  );
};

export default Logo;
