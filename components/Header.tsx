import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/Logo';
import { Page } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onNavigate, currentPage, isSidebarOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isHomePage = currentPage === 'Home';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isHomePage) {
        // h-20 is 5rem or 80px. Change header when hero section scrolls out of view.
        const headerHeight = 80;
        setIsScrolled(currentScrollY > window.innerHeight - headerHeight);
      } else {
        setIsScrolled(currentScrollY > 50);
      }

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on mount to set initial state correctly

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const showSolidHeader = !isHomePage || isScrolled;

  const headerClasses = showSolidHeader
    ? 'bg-beige/90 backdrop-blur-md'
    : 'bg-transparent';
  const textClasses = showSolidHeader ? 'text-brown-dark' : 'text-white';
  const logoColor = showSolidHeader ? '#5D534A' : '#FFFFFF';
  const visibilityClass = isVisible ? 'translate-y-0' : '-translate-y-full';

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 z-40 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${headerClasses} ${visibilityClass}`}>
      {/* Left: Menu Button */}
      <div className="w-24 md:flex-1 flex justify-start">
        <button onClick={onMenuClick} className="relative w-24 h-6 flex items-center justify-start group">
          {/* MENU State */}
          <div className={`absolute inset-0 flex items-center gap-2 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 group-hover:opacity-70 transition-colors duration-300 ${textClasses}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            <span className={`font-sans text-xs font-medium tracking-widest group-hover:opacity-70 transition-colors duration-300 ${textClasses}`}>MENU</span>
          </div>
          {/* CLOSE State */}
          <div className={`absolute inset-0 flex items-center gap-2 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 group-hover:opacity-70 transition-colors duration-300 ${textClasses}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className={`font-sans text-xs font-medium tracking-widest group-hover:opacity-70 transition-colors duration-300 ${textClasses}`}>CLOSE</span>
          </div>
        </button>
      </div>


      {/* Center: Logo */}
      <div className="flex-shrink-0 h-12 w-auto transition-colors duration-300">
        <Logo color={logoColor} />
      </div>

      {/* Right: Navigation */}
      <div className="w-24 md:flex-1 flex justify-end">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate('Gallery')} className={`font-sans text-xs font-medium tracking-widest hover:opacity-70 transition-colors duration-300 ${textClasses}`}>
            GALLERY
          </button>
          <button onClick={() => onNavigate('Contact')} className={`font-sans text-xs font-medium tracking-widest hover:opacity-70 transition-colors duration-300 ${textClasses}`}>
            CONTACT
          </button>
        </div>
        {/* Mobile Contact Button */}
        <div className="md:hidden">
           <button onClick={() => onNavigate('Contact')} className={`font-sans text-xs font-medium tracking-widest hover:opacity-70 transition-colors duration-300 ${textClasses}`}>
            CONTACT
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;