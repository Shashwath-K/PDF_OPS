// src/components/FileDropzone.jsx

import React, { useState, useRef, useCallback } from "react";
import {
  DocumentArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";

const FileDropzone = ({ onFilesChange, inputProps = {}, prompt }) => {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  // Propagate changes up to the parent component
  const setAndPropagateFiles = (newFiles) => {
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    
    // Convert FileList to array and add to existing files
    const newFiles = Array.from(e.dataTransfer.files).filter(
      (file) => !files.some((f) => f.name === file.name) // Avoid duplicates
    );
    setAndPropagateFiles([...files, ...newFiles]);
  };

  const onFilesSelected = (e) => {
    const newFiles = Array.from(e.target.files).filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    setAndPropagateFiles([...files, ...newFiles]);
    // Clear the input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (fileName) => {
    const newFiles = files.filter((f) => f.name !== fileName);
    setAndPropagateFiles(newFiles);
  };

  const clearAllFiles = () => {
    setAndPropagateFiles([]);
  };

  // Dynamically set border color based on drag state
  const dropzoneClasses = `
    flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg 
    cursor-pointer transition-colors duration-200 ease-in-out
    ${
      isOver
        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
    }
  `;

  return (
    <div className="w-full">
      {/* The Dropzone */}
      <div
        className={dropzoneClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFilesSelected}
          {...inputProps} // Apply props like 'accept', 'multiple', 'webkitdirectory'
        />
        <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          {prompt || "Drag & drop files here, or click to select"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {inputProps.accept || "All file types"}
        </p>
      </div>

      {/* The File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Selected Files ({files.length})
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear All
            </button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex items-center min-w-0">
                  <DocumentIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {/* Show folder path for directory uploads */}
                    {file.webkitRelativePath || file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;