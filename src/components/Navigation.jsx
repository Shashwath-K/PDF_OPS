// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import PdfMain from "../PdfMain";
import PdfCombine from "../PdfCombine";
import PdfCompress from "../PdfCompress";
import ZipFolder from "../ZipFolder";
import Navigation from "./Navigation";
import Footer from "./Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100">
        <motion.header
          className="w-full bg-white bg-opacity-90 shadow-md py-6 mb-6"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-xl">
            PDF Toolkit
          </h1>
        </motion.header>
        <main className="flex-1 w-full">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Navigation />
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mt-4"
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <PdfMain activeComponent="combine" Component={PdfCombine} />
                  }
                />
                <Route
                  path="/compress"
                  element={
                    <PdfMain activeComponent="compress" Component={PdfCompress} />
                  }
                />
                <Route
                  path="/zip"
                  element={
                    <PdfMain activeComponent="zip" Component={ZipFolder} />
                  }
                />
              </Routes>
            </motion.section>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
