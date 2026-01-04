import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Experiences from './pages/Experiences.tsx';
import Contact from './pages/Contact.tsx';
import Gallery from './pages/Gallery.tsx';
import DeveloperPanel from './components/DeveloperPanel.tsx';
import PinModal from './components/PinModal.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import { Page } from './types.ts';
import { db } from './firebase.ts';
import { ref, get } from 'firebase/database';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('Home');

  useEffect(() => {
    const preloadPageImages = () => {
      const imageUrls = [
        'https://iili.io/fjLP1DJ.md.jpg', // Home
        'https://iili.io/fjLiN1V.md.jpg', // Home
        'https://iili.io/fjP0rIp.md.jpg', // About
        'https://iili.io/fjiFKQI.md.jpg', // Contact
        'https://iili.io/fjPj3kF.md.jpg', // Experiences
        'https://iili.io/fjPwznj.md.jpg', // Experiences
        'https://iili.io/fjPNmLG.jpg',    // Experiences
        'https://iili.io/fjPCkNf.md.jpg', // Experiences
      ];
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    const preloadGalleryImages = async () => {
      try {
        const imagesRef = ref(db, 'gallery');
        const snapshot = await get(imagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          Object.values(data).forEach((imageData: any) => {
            if (imageData && typeof imageData.src === 'string') {
              const img = new Image();
              img.src = imageData.src;
            }
          });
        }
      } catch (error) {
        console.error("Failed to preload gallery images:", error);
      }
    };

    preloadPageImages();

    const handleLoad = () => {
      // Start fade out animation
      setIsFinishing(true);
      // Remove splash screen from DOM after animation
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // matches transition duration
      // Start preloading after the main content is visible
      preloadGalleryImages();
    };

    // If document is already loaded, fire immediately.
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Failsafe timeout in case 'load' event fails
      const timer = setTimeout(handleLoad, 3000); 
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleRequestDevModeAccess = () => {
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsDevPanelOpen(true);
  };

  return (
    <div className="bg-beige text-brown-dark min-h-screen font-sans">
      {isLoading && <SplashScreen isFinishing={isFinishing} />}
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main>
        <div style={{ display: currentPage === 'Home' ? 'block' : 'none' }}><Home /></div>
        <div style={{ display: currentPage === 'About' ? 'block' : 'none' }}><About /></div>
        <div style={{ display: currentPage === 'Experiences' ? 'block' : 'none' }}><Experiences /></div>
        <div style={{ display: currentPage === 'Contact' ? 'block' : 'none' }}><Contact /></div>
        <div style={{ display: currentPage === 'Gallery' ? 'block' : 'none' }}><Gallery /></div>
      </main>
      <Footer onNavigate={handleNavigate} onRequestDevModeAccess={handleRequestDevModeAccess} />
      {isPinModalOpen && <PinModal onClose={() => setIsPinModalOpen(false)} onSuccess={handlePinSuccess} />}
      {isDevPanelOpen && <DeveloperPanel onClose={() => setIsDevPanelOpen(false)} />}
    </div>
  );
};

export default App;