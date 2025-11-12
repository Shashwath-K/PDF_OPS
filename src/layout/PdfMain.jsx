import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// --- Import your pages ---
import PdfCombine from "../pages/PdfCombine";
import PdfCompress from "../pages/PdfCompress";
import ZipFolder from "../pages/ZipFolder";

/**
 * Reusable wrapper component to apply uniform
 * animations to every page.
 */
const PageWrapper = ({ children }) => (
  <motion.div
    // Use the slide-up animation from your tailwind.config.js
    // We can also define it inline for more control
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

/**
 * This component now controls all routing and page transitions.
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
        {/* You can add a 404 route here later if you want */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </AnimatePresence>
  );
};

export default PdfMain;