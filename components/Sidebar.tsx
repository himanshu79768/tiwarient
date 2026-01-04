import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const MenuLink: React.FC<{
  page: Page;
  onNavigate: (page: Page) => void;
  isActive: boolean;
}> = ({ page, onNavigate, isActive }) => {
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`font-serif text-lg transition-colors duration-300 text-left ${
        isActive ? 'text-beige' : 'text-beige/60 hover:text-beige'
      }`}
    >
      {page}
    </button>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-sans text-xs text-beige/50 tracking-widest mb-4">{children}</h3>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  return (
    <div
      className={`fixed inset-0 bg-brown-dark z-50 transform transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="h-20 flex items-center justify-between px-6 md:px-12">
         <button onClick={onClose} className="flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beige group-hover:opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-sans text-xs font-medium tracking-widest text-beige group-hover:opacity-70">CLOSE</span>
          </button>
          <button onClick={() => onNavigate('Contact')} className="font-sans text-xs font-medium tracking-widest text-beige hover:opacity-70">
            CONTACT
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16 flex flex-col" style={{ height: 'calc(100vh - 5rem)'}}>
        <div className="flex-grow grid grid-cols-2 gap-x-8 gap-y-8 md:gap-12">
          {/* General Info */}
          <div className="pl-4 md:pl-8">
            <SectionTitle>GENERAL INFO</SectionTitle>
            <div className="flex flex-col items-start space-y-3">
              <MenuLink page="Home" onNavigate={onNavigate} isActive={currentPage === 'Home'} />
              <MenuLink page="About" onNavigate={onNavigate} isActive={currentPage === 'About'} />
              <MenuLink page="Experiences" onNavigate={onNavigate} isActive={currentPage === 'Experiences'} />
              <MenuLink page="Contact" onNavigate={onNavigate} isActive={currentPage === 'Contact'} />
            </div>
          </div>

          {/* Location */}
          <div className="text-left pr-4 md:pr-8">
            <SectionTitle>LOCATION</SectionTitle>
            <p className="font-serif text-lg text-beige/80">
              Khorlim, Mapusa,<br/>Goa, 403507.
            </p>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Khorlim%2C+Mapusa%2C+Goa%2C+403507" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-beige/20 hover:bg-beige/30 text-beige font-sans text-xs font-medium tracking-widest px-4 py-2 rounded-md transition-colors"
            >
              VIEW ON MAP
            </a>
          </div>

          {/* Explore */}
          <div className="pl-4 md:pl-8">
            <SectionTitle>EXPLORE</SectionTitle>
            <div className="flex flex-col items-start space-y-3">
              <MenuLink page="Gallery" onNavigate={onNavigate} isActive={currentPage === 'Gallery'} />
            </div>
          </div>

          {/* Contact */}
          <div className="text-left pr-4 md:pr-8">
            <SectionTitle>CONTACT</SectionTitle>
            <div className="font-serif text-lg flex flex-col items-start">
              <a href="mailto:tiwarienterprises@gmail.com" className="text-beige/80 hover:text-beige break-all">tiwarienterprises@gmail.com</a>
              <a href="tel:+919049600466" className="text-beige/80 hover:text-beige mt-2">+91 9049600466</a>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 md:hidden">
          <img 
            src="https://iili.io/fjP0rIp.md.jpg" 
            alt="Modern interior design" 
            className="w-full h-48 object-cover rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;