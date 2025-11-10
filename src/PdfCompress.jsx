// src/PdfCompress.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

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

  // Handle single PDF file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFileToCompress(selected);
      setMessage(`File "${selected.name}" selected for compression.`);
    }
  };

  /**
   * Compress PDF using a lossy re-rendering method.
   * @param {'small' | 'max'} level - Compression level.
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
      const fileBytes = await fileToCompress.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: fileBytes });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
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

        // Embed JPEG image into new PDF
        const jpgDataUrl = canvas.toDataURL("image/jpeg", quality);
        const jpgImage = await newPdf.embedJpg(jpgDataUrl);

        const newPage = newPdf.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });

        page.cleanup();
        canvas.remove();
      }

      const compressedBytes = await newPdf.save(pakoOptions);
      triggerDownload(compressedBytes, `compressed-${level}.pdf`, "application/pdf");
    } catch (error) {
      console.error("Error compressing PDF:", error);
      setMessage(`Error: ${error.message}. The PDF might be corrupt, encrypted, or too large.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !libsLoaded || !fileToCompress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Compress PDF</h2>
      <p className="mb-6 text-gray-600 text-center">
        Select a single PDF file to compress. This method re-renders each page as an image, reducing file size but making text unselectable.
      </p>

      <input
        type="file"
        accept="application/pdf"
        disabled={isDisabled}
        onChange={handleFileSelect}
        className="block w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-900 bg-gray-50"
      />

      <div className="flex gap-4 justify-center flex-wrap">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => compressPdf("small")}
          className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Small Compression
          <span className="block text-xs font-normal mt-1">(Better Quality, Larger File)</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => compressPdf("max")}
          className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Max Compression
          <span className="block text-xs font-normal mt-1">(Lower Quality, Smaller File)</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PdfCompress;
