import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import DeveloperPanel from './components/DeveloperPanel';
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
        return <Experience />;
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
      <Header onMenuClick={() => setIsSidebarOpen(true)} onNavigate={handleNavigate} currentPage={currentPage} />
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
