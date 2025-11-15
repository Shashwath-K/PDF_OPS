// src/pages/PdfCompress.jsx

import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

// --- (Helper components: downloadFile, SpinnerIcon, CancelIcon, DownloadIcon) ---
// ... (paste the 4 helper components from the previous step here) ...
const downloadFile = (blob, filename) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
const SpinnerIcon = () => (
  <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
  </svg>
);
const CancelIcon = () => (
  <svg className="spinner-icon" style={{ animation: 'none' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const DownloadIcon = () => (
  <svg className="spinner-icon" style={{ animation: 'none' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
// --- (End of helper components) ---

const PdfCompress = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [useCompression, setUseCompression] = useState(true);
  const [useFlatten, setUseFlatten] = useState(false);
  
  // --- NEW: State for Zip Level ---
  // 6 is the default for JSZip
  const [zipLevel, setZipLevel] = useState(6); 

  const [processedFileBlob, setProcessedFileBlob] = useState(null);
  const [processedFileName, setProcessedFileName] = useState("");

  const processFile = async (file, options) => {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    if (options.useFlatten) {
      try { pdfDoc.flatten(); } 
      catch (flattenError) { console.warn(`Could not flatten ${file.name}: ${flattenError.message}`); }
    }
    
    return pdfDoc.save({ useObjectStreams: options.useCompression });
  };

  const handleCompress = async () => {
    setIsLoading(true);
    setError(null);
    setProcessedFileBlob(null);
    
    const options = { useCompression, useFlatten };
    let blob;
    let fileName;

    try {
      if (files.length === 1) {
        // --- Process a SINGLE file ---
        const file = files[0];
        const processedBytes = await processFile(file, options);
        blob = new Blob([processedBytes], { type: "application/pdf" });
        const originalName = file.name.endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
        fileName = `${originalName}-processed.pdf`;
      } else {
        // --- Process MULTIPLE files and zip them ---
        const zip = new JSZip();
        
        for (const file of files) {
          const processedBytes = await processFile(file, options);
          const originalName = file.name.endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
          zip.file(`${originalName}-processed.pdf`, processedBytes);
        }
        
        // --- NEW: Apply zip level ---
        blob = await zip.generateAsync({ 
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: parseInt(zipLevel) // Pass the state variable
          }
        });
        fileName = "pdf-ops-compressed.zip";
      }
      
      downloadFile(blob, fileName);
      setProcessedFileBlob(blob);
      setProcessedFileName(fileName);
      setFiles([]); 
      setError(null); 
    } catch (err) {
      console.error(err);
      setError("An error occurred during processing. One or more files may be corrupt or encrypted.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAgain = () => {
    if (processedFileBlob) {
      downloadFile(processedFileBlob, processedFileName);
    }
  };

  const handleStartNew = () => {
    setFiles([]);
    setProcessedFileBlob(null);
    setProcessedFileName("");
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Process PDFs</h2>
        <p>Apply compression & flattening. True compression (Min/Max) is not possible in a browser.</p>
      </div>
      
      {error && (<div className="alert alert-error">{error}</div>)}

      {processedFileBlob ? (
         <div className="alert alert-success">
          Your file(s) have been processed successfully!
        </div>
      ) : (
        <FileDropzone
          onFilesChange={(newFiles) => {
            setProcessedFileBlob(null);
            setError(null);
            setFiles(newFiles);
          }}
          inputProps={{ accept: "application/pdf", multiple: true }}
          prompt="Drag & drop PDFs here, or click to select"
        />
      )}

      {files.length > 0 && (
        <div className="compress-options">
          <h3>Processing Options</h3>
          
          <div className="form-check-group">
            <label className="form-check-label">
              <input 
                type="checkbox" 
                checked={useCompression} 
                onChange={e => setUseCompression(e.target.checked)}
                disabled={isLoading}
              />
              Compress (Use Object Streams)
            </label>
            <p className="form-check-help">
              Rewrites the PDF structure. May reduce size, but can also increase it.
            </p>
          </div>
          
          <div className="form-check-group">
            <label className="form-check-label">
              <input 
                type="checkbox" 
                checked={useFlatten} 
                onChange={e => setUseFlatten(e.target.checked)}
                disabled={isLoading}
              />
              Flatten Form Fields
            </label>
            <p className="form-check-help">
              Makes interactive form fields (e.g., text boxes) non-editable.
            </p>
          </div>
          
          {/* --- NEW: Zip Compression Level (only shows for 2+ files) --- */}
          {files.length > 1 && (
            <div className="form-group"> {/* Re-using .form-group for spacing */}
              <label className="form-label" htmlFor="zip-level">
                Zip Compression Level
              </label>
              <select 
                id="zip-level"
                className="form-select"
                value={zipLevel}
                onChange={e => setZipLevel(e.target.value)}
                disabled={isLoading}
              >
                <option value={0}>Min (Store only, fastest)</option>
                <option value={6}>Normal (Default, recommended)</option>
                <option value={9}>Max (Best compression, slowest)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* --- (Button logic remains the same) --- */}
      {files.length > 0 && (
        <div className="page-action-buttons">
          <button onClick={handleCompress} className="btn btn-primary btn-full-width" disabled={isLoading}>
            {isLoading ? (<><SpinnerIcon /> Processing...</>) : (`Process ${files.length} ${files.length === 1 ? "File" : "Files"}`)}
          </button>
          <button onClick={() => setFiles([])} className="btn btn-secondary btn-full-width" disabled={isLoading}>
            <CancelIcon /> Cancel
          </button>
        </div>
      )}
      
      {processedFileBlob && !isLoading && files.length === 0 && (
        <div className="page-action-buttons">
          <button onClick={handleDownloadAgain} className="btn btn-primary btn-full-width">
            <DownloadIcon /> Download Again
          </button>
          <button onClick={handleStartNew} className="btn btn-secondary btn-full-width">
            <CancelIcon /> Start New
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;