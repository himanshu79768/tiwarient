import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/Logo.tsx';
import { Page } from '../types.ts';

interface HeaderProps {
  onMenuClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHomePage = currentPage === 'Home';
  const showSolidHeader = !isHomePage || isScrolled;

  const headerClasses = showSolidHeader
    ? 'bg-beige/90 backdrop-blur-md'
    : 'bg-transparent';
  const textClasses = showSolidHeader ? 'text-brown-dark' : 'text-white';
  const logoColor = showSolidHeader ? '#5D534A' : '#FFFFFF';
  const visibilityClass = isVisible ? 'translate-y-0' : '-translate-y-full';

  return (
    <header className={`fixed top-0 left-0 right-0 h-24 z-40 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${headerClasses} ${visibilityClass}`}>
      {/* Left: Menu Button */}
      <button onClick={onMenuClick} className="flex items-center gap-2 group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 group-hover:opacity-70 transition-colors duration-300 ${textClasses}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8h16M4 16h16"
          />
        </svg>
        <span className={`font-sans text-xs font-medium tracking-widest group-hover:opacity-70 transition-colors duration-300 ${textClasses}`}>MENU</span>
      </button>

      {/* Center: Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-auto transition-colors duration-300">
        <Logo color={logoColor} />
      </div>

      {/* Right: Navigation (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => onNavigate('Gallery')} className={`font-sans text-xs font-medium tracking-widest hover:opacity-70 transition-colors duration-300 ${textClasses}`}>
          GALLERY
        </button>
        <button onClick={() => onNavigate('Contact')} className={`font-sans text-xs font-medium tracking-widest hover:opacity-70 transition-colors duration-300 ${textClasses}`}>
          CONTACT
        </button>
      </div>
    </header>
  );
};

export default Header;