// src/pages/ZipFolder.jsx

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

const ZipFolder = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleZip = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      
      for (const file of files) {
        // Read the file as an ArrayBuffer
        const fileBuffer = await file.arrayBuffer();
        
        // Use webkitRelativePath to preserve folder structure
        // This is the key to zipping a "folder"
        zip.file(file.webkitRelativePath, fileBuffer);
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Try to get the root folder name for the download
      const rootFolder = files[0]?.webkitRelativePath.split('/')[0] || "folder";
      downloadFile(zipBlob, `${rootFolder}.zip`);
      
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("An error occurred while zipping the folder.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Zip Folder</h2>
        <p>Select a folder to compress all its contents into a .zip file.</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          webkitdirectory: "true",
          directory: "true",
          multiple: true,
        }}
        prompt="Click to select a folder to zip"
      />

      {files.length > 0 && (
        <div className="page-action-buttons">
          <button
            onClick={handleZip}
            className="btn btn-primary btn-full-width"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerIcon /> Zipping...
              </>
            ) : (
              `Create Zip (${files.length} files)`
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

export default ZipFolder;