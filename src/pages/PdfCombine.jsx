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

// --- NEW: Cancel Icon ---
// Uses existing "spinner-icon" class for styling, but disables animation
const CancelIcon = () => (
  <svg
    className="spinner-icon"
    style={{ animation: 'none' }} // Override spin animation
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3} // Bolder "X"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- NEW: Download Icon ---
// Uses existing "spinner-icon" class for styling, but disables animation
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

const PdfCombine = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- NEW: State to hold the successful result ---
  const [processedFileBlob, setProcessedFileBlob] = useState(null);
  const [processedFileName, setProcessedFileName] = useState("");

  const handleCombine = async () => {
    setIsLoading(true);
    setError(null);
    setProcessedFileBlob(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const fileName = "pdf-ops-merged.pdf";
      
      downloadFile(blob, fileName);

      // --- NEW: Save the result to state ---
      setProcessedFileBlob(blob);
      setProcessedFileName(fileName);
      setFiles([]); // Clear files
      setError(null); // Clear any old errors

    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs. Please check the files and try again.");
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

  const canCombine = files.length > 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Combine PDFs</h2>
        <p>Merge multiple PDF files into a single document.</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* --- NEW: Show success message instead of dropzone on success --- */}
      {processedFileBlob ? (
        <div className="alert alert-success">
          Your file has been combined successfully!
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

      {/* --- NEW: Conditional Button Rendering --- */}
      
      {/* State 1: Files are selected, ready to combine */}
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
            <CancelIcon />
            Cancel
          </button>
        </div>
      )}
      
      {/* State 2: Combine is done, show Download/Start New */}
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

export default PdfCombine;