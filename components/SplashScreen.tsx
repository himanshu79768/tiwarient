import React from 'react';
import Logo from '../assets/Logo';

interface SplashScreenProps {
  isFinishing: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFinishing }) => {
  return (
    <div 
      className={`fixed inset-0 bg-beige z-[100] flex items-center justify-center transition-opacity duration-500 ${isFinishing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-hidden={isFinishing}
    >
      <div className="w-48 h-auto animate-pulse">
        <Logo color="#5D534A" />
      </div>
    </div>
  );
};

export default SplashScreen;
