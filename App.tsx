import React, { useState } from 'react';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Experiences from './pages/Experiences.tsx';
import Contact from './pages/Contact.tsx';
import Gallery from './pages/Gallery.tsx';
import DeveloperPanel from './components/DeveloperPanel.tsx';
import { Page } from './types.ts';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('Home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home />;
      case 'About':
        return <About />;
      case 'Experiences':
        return <Experiences />;
      case 'Contact':
        return <Contact />;
      case 'Gallery':
        return <Gallery />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="bg-beige text-brown-dark min-h-screen font-sans">
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
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} onUnlockDevMode={() => setIsDevPanelOpen(true)} />
      {isDevPanelOpen && <DeveloperPanel onClose={() => setIsDevPanelOpen(false)} />}
    </div>
  );
};

export default App;