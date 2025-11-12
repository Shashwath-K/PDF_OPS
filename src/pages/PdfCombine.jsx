// src/PdfCombine.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

function PdfCombine({
  libsLoaded,
  pdfLib,
  pakoLib,
  triggerDownload,
  setMessage,
  setIsLoading,
  isLoading,
}) {
  const [filesToCombine, setFilesToCombine] = useState([]);

  const handleCombineFiles = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFilesToCombine(selectedFiles);
      setMessage(`${selectedFiles.length} files selected for combining.`);
    }
  };

  const combinePdfs = async () => {
    if (filesToCombine.length < 2) {
      setMessage("Please select at least two PDF files to combine.");
      return;
    }
    if (!libsLoaded) {
      setMessage("Libraries are not loaded yet. Please wait.");
      return;
    }

    setIsLoading(true);
    setMessage("Combining PDFs... This may take a moment.");

    try {
      const mergedPdf = await pdfLib.PDFDocument.create();

      const pakoOptions = {
        pako: {
          inflate: pakoLib.inflate,
          deflate: pakoLib.deflate,
        },
      };

      for (const file of filesToCombine) {
        const fileBytes = await file.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(fileBytes, {
          ...pakoOptions,
          ignoreEncryption: true,
        });

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save(pakoOptions);
      triggerDownload(mergedPdfBytes, "combined.pdf", "application/pdf");
      setFilesToCombine([]);
      setMessage("PDFs combined successfully!");
    } catch (error) {
      console.error("Error combining PDFs:", error);
      setMessage(`Error: ${error.message}. One of the PDFs might be corrupt or encrypted.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !libsLoaded || filesToCombine.length < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Combine Multiple PDFs</h2>
      <p className="mb-6 text-gray-600 text-center">
        Select two or more PDF files. They will be merged in the order you selected them.
      </p>

      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleCombineFiles}
        disabled={isDisabled}
        className="block w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-900 bg-gray-50"
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={isDisabled}
        onClick={combinePdfs}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Combine {filesToCombine.length > 0 ? `(${filesToCombine.length}) Files` : "PDFs"}
      </motion.button>
    </motion.div>
  );
}

export default PdfCombine;
