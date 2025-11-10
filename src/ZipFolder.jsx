// src/ZipFolder.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

function ZipFolder({
  libsLoaded,
  jszip,
  triggerDownload,
  setMessage,
  setIsLoading,
  isLoading,
}) {
  const [filesToZip, setFilesToZip] = useState([]);

  const handleFolderSelect = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFilesToZip(selected);
      setMessage(`${selected.length} files selected for compression.`);
    }
  };

  const compressFolder = async (level) => {
    if (filesToZip.length === 0) {
      setMessage("Please select a folder or files to compress.");
      return;
    }
    if (!libsLoaded || !jszip) {
      setMessage("Libraries are not loaded yet. Please wait.");
      return;
    }

    setIsLoading(true);

    let compression = "DEFLATE";
    let compressionOptions = { level: 6 };
    let levelName = "Mid";

    if (level === "min") {
      compression = "STORE";
      compressionOptions = null;
      levelName = "Min";
    } else if (level === "max") {
      compressionOptions = { level: 9 };
      levelName = "Max";
    }

    setMessage(`Compressing folder (${levelName})... please wait.`);

    try {
      const zip = new jszip();

      for (const file of filesToZip) {
        const path = file.webkitRelativePath || file.name;
        zip.file(path, file, {
          compression,
          ...(compressionOptions && { compressionOptions }),
        });
      }

      const content = await zip.generateAsync(
        {
          type: "uint8array",
          compression,
          compressionOptions: compressionOptions || undefined,
        },
        (metadata) => {
          if (metadata.currentFile) {
            setMessage(
              `Zipping: ${metadata.percent.toFixed(0)}% (${metadata.currentFile})`
            );
          } else {
            setMessage(`Zipping: ${metadata.percent.toFixed(0)}%`);
          }
        }
      );

      triggerDownload(content, `folder-${levelName}.zip`, "application/zip");
      setFilesToZip([]);
      setMessage(`Folder compressed (${levelName}) successfully!`);
    } catch (error) {
      console.error("Error compressing folder:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !libsLoaded || filesToZip.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Compress Folder to .zip</h2>
      <p className="mb-4 text-gray-600 text-center">
        Select a folder or group of files to compress. All files and subfolders will be added into a single ZIP archive.
      </p>

      <label className="block mb-3 text-gray-600 text-sm text-center select-none">
        Note: Folder selection (via “Choose Folder”) may not be supported in all browsers — works best in Chrome or Edge.
      </label>

      <input
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelect}
        disabled={isDisabled}
        className="block w-full mb-8 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
      />

      <div className="flex flex-wrap gap-4 justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => compressFolder("min")}
          className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Min Compression
          <span className="block text-xs font-normal mt-1">(Store only, fastest)</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => compressFolder("mid")}
          className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Mid Compression
          <span className="block text-xs font-normal mt-1">(Balanced performance)</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => compressFolder("max")}
          className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Max Compression
          <span className="block text-xs font-normal mt-1">(Smallest file, slowest)</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ZipFolder;
