// src/layout/PdfMain.jsx (or src/pages/PdfMain.jsx)

import React from "react";
import { Link } from "react-router-dom";
// Using the same icons from your WelcomeLoader
import { DocumentIcon, FileIcon, ZipIcon } from "../components/DoodleIcons";

const PdfMain = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Operations Toolkit</h2>
        <p>Please select an operation to begin.</p>
      </div>

      {/* A new grid to display the 3 options */}
      <div className="home-grid">
        
        {/* Combine Card */}
        <Link to="/combine" className="home-card">
          <DocumentIcon />
          <h3>Combine PDFs</h3>
          <p>Merge multiple PDF files into one.</p>
        </Link>
        
        {/* Compress Card */}
        <Link to="/compress" className="home-card">
          <FileIcon /> {/* Using FileIcon for Compress */}
          <h3>Process PDFs</h3>
          <p>Apply compression or flatten fields.</p>
        </Link>
        
        {/* Zip Card */}
        <Link to="/zip" className="home-card">
          <ZipIcon />
          <h3>Zip Folder</h3>
          <p>Compress an entire folder into a .zip.</p>
        </Link>

      </div>
    </div>
  );
};

export default PdfMain;