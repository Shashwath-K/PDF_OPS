// src/pages/PdfCompress.jsx

import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import { PDFDocument } from "pdf-lib"; // Import pdf-lib
import JSZip from "jszip"; // Import jszip

// Re-use the helpers from the other file
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

  const handleCompress = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        
        // This is the compression part.
        // It rewrites the PDF using object streams.
        const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
        });
        
        // Add the compressed file to the zip
        zip.file(`compressed-${file.name}`, compressedBytes);
      }
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Download the zip
      downloadFile(zipBlob, "pdf-ops-compressed.zip");
      
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("An error occurred during compression. One or more files may be corrupt or encrypted.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Compress PDF</h2>
        <p>Reduce file size by rewriting and compressing. Results may vary.</p>
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
        <div className="page-action-buttons">
          <button
            onClick={handleCompress}
            className="btn btn-primary btn-full-width"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerIcon /> Compressing...
              </>
            ) : (
              `Compress ${files.length} ${files.length === 1 ? "File" : "Files"}`
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