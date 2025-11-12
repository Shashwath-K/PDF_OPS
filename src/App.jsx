import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";
// --- 1. Updated Imports (based on new structure) ---
import PdfMain from "./layout/PdfMain";
import PdfCombine from "./pages/PdfCombine"; 
import PdfCompress from "./pages/PdfCompress"; 
import ZipFolder from "./pages/ZipFolder"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import WelcomeLoader from "./components/WelcomeLoader";
import ScrollToTop from "./components/ScrollToTop";

// --- 2. Theme Hook (for consistent light/dark mode) ---
// This hook manages the theme state and persists it to localStorage.
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Check for saved theme or system preference
    return savedTheme
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return [theme, toggleTheme];
};

const AppContent = ({ mainRef, toggleTheme, currentTheme }) => {
  return (
    <>
      <ScrollToTop scrollRef={mainRef} />
      
      <header className="app-header">
        <Navigation toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </header>

      {/* --- THIS IS THE FIX --- */}
      {/* 1. Use .app-main to control layout and centering */}
      <main ref={mainRef} className="app-main">
        {/* 2. .content-card is now centered by .app-main */}
        <section className="content-card">
          <PdfMain />
        </section>
      </main>
      
      {/* 3. The footer class remains .app-footer, so no change needed */}
      <Footer /> 
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, toggleTheme] = useTheme(); // Use the theme hook
  const mainRef = useRef(null); // The ref is defined here

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }
  }, []);

  const handleLoadingComplete = () => setIsLoading(false);

  return (
    <>
      {isLoading ? (
        <WelcomeLoader onAnimationComplete={handleLoadingComplete} />
      ) : (
        <Router>
          <AppContent
            mainRef={mainRef} // The ref is passed down here
            toggleTheme={toggleTheme}
            currentTheme={theme}
          />
        </Router>
      )}
    </>
  );
};

export default App;