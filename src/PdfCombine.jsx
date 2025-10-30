// PdfCombine.jsx
import React, { useState } from "react";

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

  /** Handle file selection */
  const handleCombineFiles = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFilesToCombine(selectedFiles);
      setMessage(`${selectedFiles.length} files selected for combining.`);
    }
  };

  /** Combine multiple PDFs using pdf-lib */
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
    } catch (e) {
      console.error("Error combining PDFs:", e);
      setMessage(`Error: ${e.message}. One of the PDFs might be corrupt or encrypted.`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    fileInput:
      "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5 mb-4",
    button: (disabled) =>
      `px-6 py-3 text-white font-bold rounded-lg shadow-md focus:outline-none ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 transition-colors"
      }`,
  };

  const uiDisabled = isLoading || !libsLoaded;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Combine Multiple PDFs</h2>
      <p className="text-gray-600 mb-4">
        Select two or more PDF files. They will be merged in the order you selected them.
      </p>

      <input
        type="file"
        accept="application/pdf"
        multiple
        className={styles.fileInput}
        onChange={handleCombineFiles}
        disabled={uiDisabled}
      />

      <button
        className={styles.button(filesToCombine.length < 2 || uiDisabled)}
        onClick={combinePdfs}
        disabled={filesToCombine.length < 2 || uiDisabled}
      >
        Combine{" "}
        {filesToCombine.length > 0 ? `(${filesToCombine.length}) Files` : "PDFs"}
      </button>
    </div>
  );
}

export default PdfCombine;
