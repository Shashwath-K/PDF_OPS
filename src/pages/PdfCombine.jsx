import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";

const PdfCombine = () => {
  const [files, setFiles] = useState([]);

  const handleCombine = () => {
    // TODO: Add your PDF-lib merging logic here
    console.log("Combining files:", files.map(f => f.name));
    alert(`Combining ${files.length} files! (See console)`);
  };

  const canCombine = files.length > 1;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h2>Combine PDFs</h2>
        <p>Merge multiple PDF files into a single document.</p>
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
          <button
            onClick={handleCombine}
            className="btn btn-primary btn-full-width"
            disabled={!canCombine}
          >
            {canCombine
              ? `Combine ${files.length} Files`
              : "Please select at least 2 files"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCombine;