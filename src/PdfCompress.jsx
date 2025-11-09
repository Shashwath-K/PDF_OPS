// src/PdfCompress.jsx
import React, { useState } from "react";

function PdfCompress({
  libsLoaded,
  pdfLib,
  pdfjs,
  pakoLib,
  triggerDownload,
  setMessage,
  setIsLoading,
  isLoading,
}) {
  const [fileToCompress, setFileToCompress] = useState(null);

  // Handle PDF file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFileToCompress(selected);
      setMessage(`File "${selected.name}" selected for compression.`);
    }
  };

  /**
   * Compress PDF by rendering each page as JPEG and rebuilding the PDF.
   * @param {'small'|'max'} level Compression quality level
   */
  const compressPdf = async (level) => {
    if (!fileToCompress) {
      setMessage("Please select a PDF file to compress.");
      return;
    }
    if (!libsLoaded) {
      setMessage("Libraries are not loaded yet. Please wait.");
      return;
    }

    setIsLoading(true);

    const quality = level === "small" ? 0.8 : 0.5;
    const scale = level === "small" ? 1.5 : 1.0;
    const label = level === "small" ? "Small Compression" : "Max Compression";

    setMessage(`${label} in progress... please wait.`);

    const pakoOptions = {
      useObjectStreams: true,
      pako: {
        inflate: pakoLib.inflate,
        deflate: pakoLib.deflate,
      },
    };

    try {
      // Load file bytes
      const fileBytes = await fileToCompress.arrayBuffer();

      // Load PDF with pdf.js
      const loadingTask = pdfjs.getDocument({ data: fileBytes });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      // Create new PDF document with pdf-lib
      const newPdf = await pdfLib.PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        setMessage(`Compressing page ${i} of ${totalPages}...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        // Render page to canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const renderContext = { canvasContext: ctx, viewport };
        await page.render(renderContext).promise;

        // Convert canvas to JPEG image
        const jpgDataUrl = canvas.toDataURL("image/jpeg", quality);
        const jpgImage = await newPdf.embedJpg(jpgDataUrl);

        // Add new page and draw JPEG
        const newPage = newPdf.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });

        // Clean up
        page.cleanup();
        canvas.remove();
      }

      // Save and trigger download
      const compressedBytes = await newPdf.save(pakoOptions);
      triggerDownload(compressedBytes, `compressed-${level}.pdf`, "application/pdf");
    } catch (error) {
      console.error("Error compressing PDF:", error);
      setMessage(
        `Error: ${error.message}. The PDF might be corrupt, encrypted, or too large to process.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
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
      <h2 className="text-2xl font-semibold mb-4">Compress PDF</h2>
      <p className="text-gray-600 mb-4">
        Select a single PDF file to compress. This method re-renders each page as an image, reducing file size but making text unselectable.
      </p>

      <input
        type="file"
        accept="application/pdf"
        className={styles.fileInput}
        onChange={handleFileSelect}
        disabled={uiDisabled}
      />

      <div className="flex flex-wrap gap-4">
        <button
          className={styles.button(!fileToCompress || uiDisabled, "blue")}
          onClick={() => compressPdf("small")}
          disabled={!fileToCompress || uiDisabled}
        >
          Small Compression
          <span className="block text-xs font-normal">
            (Better Quality, Larger File)
          </span>
        </button>

        <button
          className={styles.button(!fileToCompress || uiDisabled, "red")}
          onClick={() => compressPdf("max")}
          disabled={!fileToCompress || uiDisabled}
        >
          Max Compression
          <span className="block text-xs font-normal">
            (Lower Quality, Smaller File)
          </span>
        </button>
      </div>
    </div>
  );
}

export default PdfCompress;
