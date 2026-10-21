// src/App.tsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/ui/BackToTop";
import ScrollToTop from "./components/ScrollToTop";

const App: React.FC = () => {
  useEffect(() => {
    const originalTitle = document.title;
    const awayMessages = [
      "👀 Come back, where’d you go?!",
      "😢 Leaving so soon?",
      "✨ The pixels await your return!",
      "🪄 Still here waiting for you...",
      "🎨 You forgot something..."
    ];

    // Properly type the timer handle for both browser and Node environments
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // schedule a title change (kept immediate here; you can increase delay)
        timeoutId = setTimeout(() => {
          const randomMessage = awayMessages[Math.floor(Math.random() * awayMessages.length)];
          document.title = randomMessage;
        }, 0);
      } else {
        // Reset title when user returns
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup when component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
    // empty deps so runs once on mount/unmount
  }, []);

  return (
    <>
      <Header />
      <ScrollToTop />
      <main id="main-content">
        <Outlet /> {/* ← Nested routes render here */}
      </main>
      <BackToTop />
      <Footer />
    </>
  );
};

export default App;
