import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

// A helper function to trigger file download
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

// A helper to show the spinner inside the button
const SpinnerIcon = () => (
  <svg
    className="spinner-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      opacity="0.25"
    ></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      opacity="0.75"
    ></path>
  </svg>
);

// --- NEW: Cancel Icon ---
const CancelIcon = () => (
  <svg
    className="spinner-icon"
    style={{ animation: 'none' }} // Override spin animation
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- NEW: Download Icon ---
const DownloadIcon = () => (
  <svg
    className="spinner-icon"
    style={{ animation: 'none' }} // Override spin animation
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const PdfCompress = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [useCompression, setUseCompression] = useState(true);
  const [useFlatten, setUseFlatten] = useState(false);

  // --- NEW: State to hold the successful result ---
  const [processedFileBlob, setProcessedFileBlob] = useState(null);
  const [processedFileName, setProcessedFileName] = useState("");

  const processFile = async (file, options) => {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    if (options.useFlatten) {
      try {
        pdfDoc.flatten();
      } catch (flattenError) {
        console.warn(`Could not flatten ${file.name}: ${flattenError.message}`);
      }
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
        
        blob = await zip.generateAsync({ type: "blob" });
        fileName = "pdf-ops-compressed.zip";
      }
      
      downloadFile(blob, fileName);

      // --- NEW: Save the result to state ---
      setProcessedFileBlob(blob);
      setProcessedFileName(fileName);
      setFiles([]); // Clear files
      setError(null); // Clear any old errors

    } catch (err) {
      console.error(err);
      setError("An error occurred during processing. One or more files may be corrupt or encrypted.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Handler for the "Download Again" button ---
  const handleDownloadAgain = () => {
    if (processedFileBlob) {
      downloadFile(processedFileBlob, processedFileName);
    }
  };

  // --- NEW: Handler to reset the page ---
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
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* --- NEW: Show success message instead of dropzone on success --- */}
      {processedFileBlob ? (
         <div className="alert alert-success">
          Your file(s) have been processed successfully!
        </div>
      ) : (
        <FileDropzone
          // When new files are dropped, clear any old results
          onFilesChange={(newFiles) => {
            setProcessedFileBlob(null);
            setError(null);
            setFiles(newFiles);
          }}
          inputProps={{
            accept: "application/pdf",
            multiple: true,
          }}
          prompt="Drag & drop PDFs here, or click to select"
        />
      )}

      {/* --- Options Box (Only show if files are selected) --- */}
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
              Rewrites the PDF structure. May reduce size, but can also increase it. Text is selectable.
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
        </div>
      )}

      {/* --- NEW: Conditional Button Rendering --- */}
      
      {/* State 1: Files are selected, ready to process */}
      {files.length > 0 && (
        <div className="page-action-buttons">
          <button
            onClick={handleCompress}
            className="btn btn-primary btn-full-width"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerIcon /> Processing...
              </>
            ) : (
              `Process ${files.length} ${files.length === 1 ? "File" : "Files"}`
            )}
          </button>
          <button
            onClick={() => setFiles([])}
            className="btn btn-secondary btn-full-width"
            disabled={isLoading}
          >
            <CancelIcon />
            Cancel
          </button>
        </div>
      )}
      
      {/* State 2: Processing is done, show Download/Start New */}
      {processedFileBlob && !isLoading && files.length === 0 && (
        <div className="page-action-buttons">
          <button 
            onClick={handleDownloadAgain} 
            className="btn btn-primary btn-full-width"
          >
            <DownloadIcon />
            Download Again
          </button>
          <button 
            onClick={handleStartNew} 
            className="btn btn-secondary btn-full-width"
          >
            <CancelIcon />
            Start New
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;