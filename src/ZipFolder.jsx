import React, { useState } from "react";

function ZipFolder({
  libsLoaded,
  jszip,
  triggerDownload,
  setMessage,
  setIsLoading,
  isLoading,
}) {
  const [filesToZip, setFilesToZip] = useState([]);

  // Handle selection of multiple files or folders
  const handleFolderSelect = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFilesToZip(selected);
      setMessage(`${selected.length} files selected for compression.`);
    }
  };

  /**
   * Compress selected files/folder into a ZIP archive
   * @param {'min'|'mid'|'max'} level Compression level
   */
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

    // Compression settings based on level
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
      // jszip is a class constructor because of fix, so instantiate directly
      const zip = new jszip();

      // Add all selected files to the zip, preserving folder structure
      for (const file of filesToZip) {
        const path = file.webkitRelativePath || file.name;
        zip.file(path, file, {
          compression,
          ...(compressionOptions && { compressionOptions }),
        });
      }

      // Generate ZIP file with progress updates
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

      // Trigger file download and reset selection
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

  // Styles for inputs and buttons
  const styles = {
    fileInput:
      "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5 mb-4",
    button: (disabled, color = "blue") => {
      const base =
        "px-6 py-3 text-white font-bold rounded-lg shadow-md focus:outline-none transition-colors";
      const colors = {
        blue: disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700",
        green: disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700",
        red: disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700",
      };
      return `${base} ${colors[color]}`;
    },
  };

  const uiDisabled = isLoading || !libsLoaded;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Compress Folder to .zip</h2>
      <p className="text-gray-600 mb-4">
        Select a folder or group of files to compress. All files and subfolders
        will be added into a single ZIP archive.
      </p>

      <label className="text-gray-600 mb-2 block text-sm">
        Note: Folder selection (via “Choose Folder”) may not be supported in all browsers — works best in Chrome or Edge.
      </label>

      <input
        type="file"
        className={styles.fileInput}
        onChange={handleFolderSelect}
        disabled={uiDisabled}
        webkitdirectory=""
        directory=""
        multiple
      />

      <div className="flex flex-wrap gap-4">
        <button
          className={styles.button(!filesToZip.length || uiDisabled, "blue")}
          onClick={() => compressFolder("min")}
          disabled={!filesToZip.length || uiDisabled}
        >
          Min Compression
          <span className="block text-xs font-normal">(Store only, fastest)</span>
        </button>

        <button
          className={styles.button(!filesToZip.length || uiDisabled, "green")}
          onClick={() => compressFolder("mid")}
          disabled={!filesToZip.length || uiDisabled}
        >
          Mid Compression
          <span className="block text-xs font-normal">(Balanced performance)</span>
        </button>

        <button
          className={styles.button(!filesToZip.length || uiDisabled, "red")}
          onClick={() => compressFolder("max")}
          disabled={!filesToZip.length || uiDisabled}
        >
          Max Compression
          <span className="block text-xs font-normal">(Smallest file, slowest)</span>
        </button>
      </div>
    </div>
  );
}

export default ZipFolder;
