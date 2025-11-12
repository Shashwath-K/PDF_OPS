import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

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
      {/* --- This uses your component and passes the ref --- */}
      <ScrollToTop scrollRef={mainRef} />

      {/* --- 3. Added dark: variants --- */}
      <header className="w-full bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 shadow-md py-6 mb-6 sticky top-0 z-50 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 tracking-tight drop-shadow-xl">
          PDF-OPS
        </h1>
        {/* Pass the toggle function to Navigation so you can add a button */}
        <Navigation toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </header>
      <main
        ref={mainRef} // The ref is created here
          className="layout-container flex-1 pb-16 overflow-y-auto"
      >
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.15 }}
          // --- 3. Added dark: variants to the main content card ---
          className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl shadow-lg p-6 mt-4"
        >
          <PdfMain />
        </motion.section>
      </main>
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