import React, { useState } from 'react';
import Logo from '../assets/Logo';
import Toast from './Toast';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onUnlockDevMode: () => void;
}

const FooterLink: React.FC<{ page: Page; onNavigate: (page: Page) => void }> = ({ page, onNavigate }) => (
  <button onClick={() => onNavigate(page)} className="text-beige/70 hover:text-beige transition-colors text-sm">
    {page}
  </button>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors">
    {children}
  </a>
);

const UNLOCK_TAPS = 7;

const Footer: React.FC<FooterProps> = ({ onNavigate, onUnlockDevMode }) => {
  const [tapCount, setTapCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const handleCopyrightClick = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= UNLOCK_TAPS) {
      onUnlockDevMode();
      setTapCount(0);
    } else {
      const tapsRemaining = UNLOCK_TAPS - newTapCount;
      setToastMessage(`You are ${tapsRemaining} tap${tapsRemaining > 1 ? 's' : ''} away from developer mode.`);
    }
  };

  return (
    <>
      <footer className="bg-brown-dark text-beige pt-16 pb-8 px-8 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Logo & About */}
          <div className="md:col-span-1 space-y-4">
            <div className="h-16 w-auto">
              <Logo color="#FCFBF8" />
            </div>
            <p className="text-sm text-beige/60">
              Leading providers of premium flooring, tiles, and plumbing solutions in Mapusa, Goa.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold tracking-wider text-beige/90 mb-4">QUICK LINKS</h3>
            <div className="flex flex-col space-y-2 items-start">
              <FooterLink page="Home" onNavigate={onNavigate} />
              <FooterLink page="About" onNavigate={onNavigate} />
              <FooterLink page="Experiences" onNavigate={onNavigate} />
              <FooterLink page="Gallery" onNavigate={onNavigate} />
              <FooterLink page="Contact" onNavigate={onNavigate} />
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-1">
            <h3 className="font-semibold tracking-wider text-beige/90 mb-4">CONTACT US</h3>
            <div className="space-y-2 text-sm text-beige/70">
              <p>Shop No. 5, Morod,<br />Mapusa, Goa, 403507</p>
              <p>info@tiwarienterprises.com</p>
              <p>+91 12345 67890</p>
            </div>
          </div>
          
          {/* Column 4: Social Media */}
          <div className="md:col-span-1">
             <h3 className="font-semibold tracking-wider text-beige/90 mb-4">FOLLOW US</h3>
             <div className="flex space-x-4">
                <SocialIcon href="#">
                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.598 0 0 .597 0 1.334v21.332C0 23.403.598 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.727 0 1.323-.597 1.323-1.334V1.334C24 .597 23.403 0 22.675 0z" /></svg>
                </SocialIcon>
                <SocialIcon href="#">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4-947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" /></svg>
                </SocialIcon>
             </div>
          </div>

        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-beige/10 text-center text-xs text-beige/50">
          <p onClick={handleCopyrightClick} className="cursor-pointer select-none">&copy; {new Date().getFullYear()} Tiwari Enterprises. All Rights Reserved.</p>
        </div>
      </footer>
      <Toast message={toastMessage} onClear={() => setToastMessage('')} />
    </>
  );
};

export default Footer;
