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
import { ref, get, set, update, increment } from 'firebase/database';

const WhatsAppButton: React.FC = () => {
    const message = encodeURIComponent("Hello Tiwari Enterprises, I would like to make an enquiry.");
    return (
        <a
            href={`https://wa.me/919049600466?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-12 right-6 z-30 bg-[#128C7E] text-white p-3 md:py-2 md:px-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#128C7E] transition-all duration-300 animate-fadeIn"
            aria-label="Chat with us on WhatsApp"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="h-6 w-6" fill="currentColor">
                <path d="M25 2C12.318 2 2 12.318 2 25c0 3.96 1.023 7.853 2.963 11.289L2.037 46.73a1.5 1.5 0 0 0 1.963 1.24l10.137-2.699C17.464 47.057 21.21 48 25 48c12.682 0 23-10.318 23-23S37.682 2 25 2zm-8.357 12c.394 0 .785.005 1.13.021.363.018.851-.138 1.33 1 .492 1.168 1.672 4.037 1.818 4.33.148.292.247.633.051 1.022-.196.389-.294.634-.59.975-.296.341-.62.76-.886 1.022-.296.291-.604.606-.26 1.19.344.584 1.529 2.493 3.285 4.039 2.255 1.986 4.158 2.603 4.748 2.895.59.292.935.243 1.279-.146.344-.39 1.476-1.702 1.869-2.285.393-.583.786-.488 1.328-.293.542.194 3.445 1.605 4.035 1.897.59.292.985.439 1.133.682.148.242.148 1.409-.344 2.77-.492 1.362-2.852 2.607-3.986 2.774-1.018.149-2.307.212-3.721-.232-.857-.27-1.956-.628-3.365-1.229-5.923-2.526-9.792-8.416-10.088-8.805C15.115 25.234 13 22.463 13 19.594c0-2.869 1.524-4.279 2.066-4.863.542-.584 1.182-.73 1.576-.73z"/>
            </svg>
            <span className="font-semibold text-sm hidden md:inline">Chat Now</span>
        </a>
    );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('Home');

  useEffect(() => {
    // Visitor Tracking
    const trackVisitor = async () => {
        let visitorId = localStorage.getItem('visitorId');
        const now = new Date().toISOString();

        if (!visitorId) {
            visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('visitorId', visitorId);

            const visitorRef = ref(db, `viewership/${visitorId}`);
            await set(visitorRef, {
                firstVisit: now,
                lastVisit: now,
                sessionCount: 1,
                deviceInfo: navigator.userAgent,
                isDeveloper: false,
            });
        } else {
            const visitorRef = ref(db, `viewership/${visitorId}`);
            await update(visitorRef, {
                lastVisit: now,
                sessionCount: increment(1),
            });
        }
    };
    
    trackVisitor();
  }, []);

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
    // Flag this visitor as a developer
    const visitorId = localStorage.getItem('visitorId');
    if (visitorId) {
        const visitorRef = ref(db, `viewership/${visitorId}`);
        update(visitorRef, { isDeveloper: true });
    }
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
      <WhatsAppButton />
    </div>
  );
};

export default App;