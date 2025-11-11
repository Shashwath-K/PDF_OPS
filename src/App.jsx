import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PdfMain from "./PdfMain";
import PdfCombine from "./PdfCombine";
import PdfCompress from "./PdfCompress";
import ZipFolder from "./ZipFolder";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import WelcomeLoader from "./components/WelcomeLoader";

function ScrollToTop({ scrollRef }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }
    requestAnimationFrame(() => {
      const container =
        (scrollRef && scrollRef.current) ||
        document.scrollingElement ||
        document.documentElement ||
        document.body;
      try {
        if (container && typeof container.scrollTo === "function") {
          container.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } else if (container) {
          container.scrollTop = 0;
        } else {
          window.scrollTo(0, 0);
        }
      } catch {
        window.scrollTo(0, 0);
      }
    });
  }, [pathname, scrollRef]);

  return null;
}

const AppContent = ({ mainRef }) => {
  return (
    <>
      <ScrollToTop scrollRef={mainRef} />
      <header className="w-full bg-white bg-opacity-90 shadow-md py-6 mb-6 sticky top-0 z-50">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-xl">
          PDF Toolkit
        </h1>
        <Navigation />
      </header>
      <main
        ref={mainRef}
        className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 overflow-y-auto"
        style={{ height: "calc(100vh - 6rem)", WebkitOverflowScrolling: "touch" }}
      >
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.15 }}
          className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mt-4"
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
  const mainRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
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
          <AppContent mainRef={mainRef} />
        </Router>
      )}
    </>
  );
};

export default App;
