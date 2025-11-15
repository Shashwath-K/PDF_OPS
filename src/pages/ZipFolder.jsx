import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import JSZip from "jszip"; // Import jszip

// Re-use the helpers
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

const ZipFolder = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- NEW: State for Zip Level ---
  const [zipLevel, setZipLevel] = useState(6); // 6 is the default

  const [processedFileBlob, setProcessedFileBlob] = useState(null);
  const [processedFileName, setProcessedFileName] = useState("");

  const handleZip = async () => {
    setIsLoading(true);
    setError(null);
    setProcessedFileBlob(null);
    
    try {
      const zip = new JSZip();
      
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        zip.file(file.webkitRelativePath, fileBuffer);
      }
      
      // --- NEW: Apply zip level ---
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: parseInt(zipLevel) // Pass the state variable
        }
      });
      
      const rootFolder = files[0]?.webkitRelativePath.split('/')[0] || "folder";
      const fileName = `${rootFolder}.zip`;

      downloadFile(zipBlob, fileName);
      
      setProcessedFileBlob(zipBlob);
      setProcessedFileName(fileName);
      setFiles([]); 
      setError(null); 

    } catch (err) {
      console.error(err);
      setError("An error occurred while zipping the folder.");
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
        <h2>Zip Folder</h2>
        <p>Select a folder to compress all its contents into a .zip file.</p>
      </div>

      {error && (<div className="alert alert-error">{error}</div>)}

      {processedFileBlob ? (
        <div className="alert alert-success">
          Your folder has been zipped successfully!
        </div>
      ) : (
        <FileDropzone
          onFilesChange={(newFiles) => {
            setProcessedFileBlob(null);
            setError(null);
            setFiles(newFiles);
          }}
          inputProps={{
            webkitdirectory: "true",
            directory: "true",
            multiple: true,
          }}
          prompt="Click to select a folder to zip"
        />
      )}

      {/* --- NEW: Zip Compression Level (always show if files > 0) --- */}
      {files.length > 0 && (
        <div className="compress-options">
          <div className="form-group">
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
        </div>
      )}

      {/* --- (Button logic remains the same) --- */}
      {files.length > 0 && (
        <div className="page-action-buttons">
          <button onClick={handleZip} className="btn btn-primary btn-full-width" disabled={isLoading}>
            {isLoading ? (<><SpinnerIcon /> Zipping...</>) : (`Create Zip (${files.length} files)`)}
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

export default ZipFolder;