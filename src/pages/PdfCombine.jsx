// src/pages/PdfCombine.jsx

import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import { PDFDocument } from "pdf-lib"; // Import pdf-lib

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

const PdfCombine = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCombine = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a new, empty PDF document
      const mergedPdf = await PDFDocument.create();

      // Loop through all selected files
      for (const file of files) {
        // Read the file as an ArrayBuffer
        const fileBuffer = await file.arrayBuffer();
        
        // Load the PDF document from the buffer
        const pdfDoc = await PDFDocument.load(fileBuffer);
        
        // Get all page indices
        const pageIndices = pdfDoc.getPageIndices();
        
        // Copy the pages from the loaded doc to the merged doc
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF as a Uint8Array
      const mergedPdfBytes = await mergedPdf.save();

      // Create a Blob and download the file
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      downloadFile(blob, "pdf-ops-merged.pdf");

      setFiles([]); // Clear files after successful merge
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs. Please check the files and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canCombine = files.length > 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Combine PDFs</h2>
        <p>Merge multiple PDF files into a single document.</p>
      </div>

      {/* Show error message if one exists */}
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
            onClick={handleCombine}
            className="btn btn-primary btn-full-width"
            disabled={!canCombine || isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerIcon /> Combining...
              </>
            ) : canCombine ? (
              `Combine ${files.length} Files`
            ) : (
              "Please select at least 2 files"
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

export default PdfCombine;