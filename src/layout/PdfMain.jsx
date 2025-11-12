import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// --- Import your pages ---
import PdfCombine from "../pages/PdfCombine";
import PdfCompress from "../pages/PdfCompress";
import ZipFolder from "../pages/ZipFolder";

/**
 * A reusable wrapper component to apply a uniform
 * fade-in/fade-out animation to every page as it changes.
 */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}    // Start invisible and slightly down
    animate={{ opacity: 1, y: 0 }}    // Fade in to full opacity at final position
    exit={{ opacity: 0, y: -15 }}     // Fade out and move slightly up
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

/**
 * This component controls all routing and page transitions.
 * 'AnimatePresence' handles the enter/exit animations.
 * 'mode="wait"' ensures the old page animates out before the new one animates in.
 */
const PdfMain = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/*
        We MUST pass the `location` object to <Routes>
        and use `location.pathname` as the `key`.

        This tells AnimatePresence *when* the route has changed,
        allowing it to manage the exit and enter animations.
      */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
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
  );
};

export default PdfMain;