import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';

const App = () => {
  useEffect(() => {
    const originalTitle = document.title;
    const awayMessages = [
      "👀 Come back, where’d you go?!",
      "😢 Leaving so soon?",
      "✨ The pixels await your return!",
      "🪄 Still here waiting for you...",
      "🎨 You forgot something..."
    ];

    let timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Add a small delay before changing title
        timeout = setTimeout(() => {
          const randomMessage =
            awayMessages[Math.floor(Math.random() * awayMessages.length)];
          document.title = randomMessage;
        }, 0);
      } else {
        // Reset title when user returns
        clearTimeout(timeout);
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup when component unmounts
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = originalTitle;
    };
  }, []);

  return (
    <>
      <Header />
      <Outlet /> {/* ← Nested routes render here */}
      <BackToTop />
      <Footer />
    </>
  );
};

export default App;
