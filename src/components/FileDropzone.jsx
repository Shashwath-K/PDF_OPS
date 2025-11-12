import React, { useState, useRef } from "react";
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

    const newFiles = Array.from(e.dataTransfer.files).filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    setAndPropagateFiles([...files, ...newFiles]);
  };

  const onFilesSelected = (e) => {
    const newFiles = Array.from(e.target.files).filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    setAndPropagateFiles([...files, ...newFiles]);
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

  // Dynamically add the 'dragging' class
  const dropzoneClasses = `file-dropzone ${isOver ? "dragging" : ""}`;

  return (
    <div className="file-dropzone-container">
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
          className="file-dropzone-input" // Replaces 'hidden'
          onChange={onFilesSelected}
          {...inputProps}
        />
        <DocumentArrowUpIcon className="file-dropzone-icon" />
        <p className="file-dropzone-prompt">
          {prompt || "Drag & drop files here, or click to select"}
        </p>
        <p className="file-dropzone-text">
          {inputProps.accept || "All file types"}
        </p>
      </div>

      {/* The File List */}
      {files.length > 0 && (
        <div className="file-list-container">
          <div className="file-list-header-wrapper">
            <h3 className="file-list-header">
              Selected Files ({files.length})
            </h3>
            <button onClick={clearAllFiles} className="file-list-clear-btn">
              Clear All
            </button>
          </div>
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.name} className="file-list-item">
                <div className="file-list-item-details">
                  <DocumentIcon className="file-list-item-icon" />
                  <span className="file-list-item-name">
                    {file.webkitRelativePath || file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="file-list-item-remove-btn"
                  aria-label={`Remove ${file.name}`}
                >
                  <XMarkIcon className="icon" />
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