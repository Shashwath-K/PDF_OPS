// src/pages/PdfCombine.jsx

import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";

const PdfCombine = () => {
  const [files, setFiles] = useState([]);

  const handleCombine = () => {
    // TODO: Add your PDF-lib merging logic here
    console.log("Combining files:", files.map(f => f.name));
    alert(`Combining ${files.length} files! (See console)`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Combine PDFs
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Merge multiple PDF files into a single document.
        </p>
      </div>

      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          accept: "application/pdf",
          multiple: true,
        }}
        prompt="Drag & drop PDFs here, or click to select"
      />

      {files.length > 0 && (
        <button
          onClick={handleCombine}
          disabled={files.length < 2}
          className="w-full py-3 px-4 font-semibold text-white bg-primary-600 rounded-lg shadow transition-all
                     hover:bg-primary-700 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     dark:bg-primary-500 dark:hover:bg-primary-600
                     disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          {files.length < 2
            ? "Please select at least 2 files"
            : `Combine ${files.length} Files`}
        </button>
      )}
    </div>
  );
};

export default PdfCombine;