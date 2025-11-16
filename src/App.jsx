import React, { useState, useEffect, useRef } from "react";
// 1. Import Router, Routes, Route, AND useLocation
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// 2. Import AnimatePresence and motion
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// --- Import all pages for the router ---
import PdfMain from "./layout/PdfMain"; // This is now the "Home" page
import PdfCombine from "./pages/PdfCombine"; 
import PdfCompress from "./pages/PdfCompress"; 
import ZipFolder from "./pages/ZipFolder"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import WelcomeLoader from "./components/WelcomeLoader";
import ScrollToTop from "./components/ScrollToTop";

// --- Theme Hook (no change) ---
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
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

// --- 3. PageWrapper (moved from old PdfMain.jsx) ---
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AppContent = ({ mainRef, toggleTheme, currentTheme }) => {
  // 4. Get the location here for AnimatePresence
  const location = useLocation();

  return (
    <>
      <ScrollToTop scrollRef={mainRef} />
      
      <header className="app-header">
        <Navigation toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </header>

      <main ref={mainRef} className="app-main">
        <section className="content-card">
          
          {/* 5. All Routing logic is now in App.jsx */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* The new "Home" page is at "/" */}
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <PdfMain />
                  </PageWrapper>
                }
              />
              {/* The 3 operations are on their own routes */}
              <Route
                path="/combine"
                element={
                  <PageWrapper>
                    <PdfCombine />
                  </PageWrapper>
                }
              />
              <Route
                path="/compress"
                element={
                  <PageWrapper>
                    <PdfCompress />
                  </PageWrapper>
                }
              />
              <Route
                path="/zip"
                element={
                  <PageWrapper>
                    <ZipFolder />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
          
        </section>
      </main>
      
      <Footer /> 
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, toggleTheme] = useTheme();
  const mainRef = useRef(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        // Ignore the error
      }
    }
  }, []);

  const handleLoadingComplete = () => setIsLoading(false);

  return (
    <>
      {isLoading ? (
        <WelcomeLoader onAnimationComplete={handleLoadingComplete} />
      ) : (
        // Router wraps AppContent, so useLocation() works
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