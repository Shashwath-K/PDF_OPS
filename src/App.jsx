// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import PdfMain from "./PdfMain";
import PdfCombine from "./PdfCombine";
import PdfCompress from "./PdfCompress";
import ZipFolder from "./ZipFolder";

function App() {
  const navClasses = ({ isActive }) =>
    `py-2 px-4 cursor-pointer text-lg transition-all ${
      isActive
        ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <Router>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 font-sans relative">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">PDF Toolkit</h1>

        {/* Navigation */}
        <nav className="flex border-b mb-4 justify-center gap-4">
          <NavLink to="/" end className={navClasses}>
            Combine PDFs
          </NavLink>
          <NavLink to="/compress" className={navClasses}>
            Compress PDF
          </NavLink>
          <NavLink to="/zip" className={navClasses}>
            Compress Folder (ZIP)
          </NavLink>
        </nav>

        {/* Routed Views */}
        <div className="p-4 border border-t-0 rounded-b-lg">
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
      </div>
    </Router>
  );
}

export default App;
