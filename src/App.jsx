// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PdfMain from "./PdfMain";
import PdfCombine from "./PdfCombine";
import PdfCompress from "./PdfCompress";
import ZipFolder from "./ZipFolder";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 font-sans relative min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">PDF Toolkit</h1>
        <Navigation />
        <div className="flex-1 p-4 border border-t-0 rounded-b-lg">
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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
