import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";

const ZipFolder = () => {
  const [files, setFiles] = useState([]);

  const handleZip = () => {
    // TODO: Add your JSZip logic here
    console.log("Zipping files:", files);
    alert(`Zipping ${files.length} files! (See console)`);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h2>Zip Folder</h2>
        <p>Select a folder to compress all its contents into a .zip file.</p>
      </div>

      {/* File Dropzone */}
      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          webkitdirectory: "true",
          directory: "true",
          multiple: true,
        }}
        prompt="Click to select a folder to zip"
      />

      {/* Action Button */}
      {files.length > 0 && (
        <div className="page-action-button-wrapper">
          <button onClick={handleZip} className="btn btn-primary btn-full-width">
            {`Create Zip (${files.length} files)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ZipFolder;