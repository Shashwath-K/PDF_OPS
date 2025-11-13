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

const PdfCompress = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [useCompression, setUseCompression] = useState(true);
  const [useFlatten, setUseFlatten] = useState(false);

  const processFile = async (file, options) => {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Apply flatten if the user checked the box
    if (options.useFlatten) {
      try {
        pdfDoc.flatten();
      } catch (flattenError) {
        console.warn(`Could not flatten ${file.name}: ${flattenError.message}`);
      }
    }
    
    // Save the PDF with the selected options
    return pdfDoc.save({ useObjectStreams: options.useCompression });
  };


  const handleCompress = async () => {
    setIsLoading(true);
    setError(null);
    
    const options = { useCompression, useFlatten };

    try {
      // --- NEW LOGIC: POINT 3 ---
      if (files.length === 1) {
        // --- Process a SINGLE file ---
        const file = files[0];
        const processedBytes = await processFile(file, options);
        
        // Create a Blob and download the single file
        const blob = new Blob([processedBytes], { type: "application/pdf" });
        const originalName = file.name.endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
        downloadFile(blob, `${originalName}-processed.pdf`);

      } else {
        // --- Process MULTIPLE files and zip them ---
        const zip = new JSZip();
        
        for (const file of files) {
          const processedBytes = await processFile(file, options);
          const originalName = file.name.endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
          zip.file(`${originalName}-processed.pdf`, processedBytes);
        }
        
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        
        // Download the zip
        downloadFile(zipBlob, "pdf-ops-compressed.zip");
      }
      
      setFiles([]); // Clear files after success
    } catch (err) {
      console.error(err);
      setError("An error occurred during processing. One or more files may be corrupt or encrypted.");
    } finally {
      setIsLoading(false);
    }
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

      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          accept: "application/pdf",
          multiple: true,
        }}
        prompt="Drag & drop PDFs here, or click to select"
      />

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
            Clear Files
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;