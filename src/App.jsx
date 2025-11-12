import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
        ref={mainRef}
        className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 overflow-y-auto"
        // Note: The main "page" color is set by the body, this main tag is transparent
      >
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.15 }}
          // --- 3. Added dark: variants to the main content card ---
          className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl shadow-lg p-6 mt-4"
        >
          <Routes>
            <Route
              path="/"
              element={<PdfMain activeComponent="combine" Component={PdfCombine} />}
            />
            <Route
              path="/compress"
              element={<PdfMain activeComponent="compress" Component={PdfCompress} />}
            />
            <Route
              path="/zip"
              element={<PdfMain activeComponent="zip" Component={ZipFolder} />}
            />
          </Routes>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, toggleTheme] = useTheme(); // Use the theme hook
  const mainRef = useRef(null);

  useEffect(() => {
    // We don't need to manually set body classes here anymore,
    // the useTheme hook handles it.
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
            mainRef={mainRef}
            toggleTheme={toggleTheme}
            currentTheme={theme}
          />
        </Router>
      )}
    </>
  );
};

export default App;