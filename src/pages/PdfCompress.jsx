import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";

const PdfCompress = () => {
  const [files, setFiles] = useState([]);

  const handleCompress = () => {
    // TODO: Add your PDF compression logic here
    console.log("Compressing files:", files.map(f => f.name));
    alert(`Compressing ${files.length} files! (See console)`);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h2>Compress PDF</h2>
        <p>Reduce the file size of one or more PDF documents.</p>
      </div>

      {/* File Dropzone */}
      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          accept: "application/pdf",
          multiple: true,
        }}
        prompt="Drag & drop PDFs here, or click to select"
      />

      {/* Action Button */}
      {files.length > 0 && (
        <div className="page-action-button-wrapper">
          <button onClick={handleCompress} className="btn btn-primary btn-full-width">
            {`Compress ${files.length} ${files.length === 1 ? "File" : "Files"}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;