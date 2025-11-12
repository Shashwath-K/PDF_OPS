// src/pages/ZipFolder.jsx

import React, { useState } from "react";
import FileDropzone from "../components/FileDropzone";

const ZipFolder = () => {
  const [files, setFiles] = useState([]);

  const handleZip = () => {
    // TODO: Add your JSZip logic here
    // The `files` state contains a flat list of all files from the folder.
    // You can use their `webkitRelativePath` to rebuild the folder structure in JSZip.
    console.log("Zipping files:", files);
    alert(`Zipping ${files.length} files! (See console)`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Zip Folder
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Select a folder to compress all its contents into a .zip file.
        </p>
      </div>

      <FileDropzone
        onFilesChange={setFiles}
        inputProps={{
          webkitdirectory: "true", // The magic prop for folder upload
          directory: "true",       // For broader compatibility
          multiple: true,
        }}
        prompt="Click to select a folder to zip"
      />

      {files.length > 0 && (
        <button
          onClick={handleZip}
          className="w-full py-3 px-4 font-semibold text-white bg-primary-600 rounded-lg shadow transition-all
                     hover:bg-primary-700 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     dark:bg-primary-500 dark:hover:bg-primary-600
                     disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          {`Create Zip (${files.length} files)`}
        </button>
      )}
    </div>
  );
};

export default ZipFolder;