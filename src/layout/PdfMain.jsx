// src/PdfMain.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PdfMain({ Component, activeComponent }) {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Loading required PDF libraries...");

  const [libsLoaded, setLibsLoaded] = useState(false);
  const [pdfLib, setPdfLib] = useState(null);
  const [pdfjs, setPdfjs] = useState(null);
  const [pakoLib, setPakoLib] = useState(null);
  const [jszip, setJszip] = useState(null);

  useEffect(() => {
    async function loadLibraries() {
      try {
        setIsLoading(true);
        setMessage("Loading PDF libraries...");

        const [
          pdfLibModule,
          pdfjsModule,
          pakoModule,
          jszipModule,
        ] = await Promise.all([
          import("https://cdn.jsdelivr.net/npm/pdf-lib@^1.17.1/dist/pdf-lib.esm.js"),
          import("https://cdn.jsdelivr.net/npm/pdfjs-dist@^4.0.379/build/pdf.mjs"),
          import("https://cdn.jsdelivr.net/npm/pako@^2.1.0/dist/pako.esm.mjs"),
          import("https://esm.sh/jszip@3.10.1"),
        ]);

        pdfjsModule.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@^4.0.379/build/pdf.worker.mjs";

        setPdfLib(pdfLibModule);
        setPdfjs(pdfjsModule);
        setPakoLib(pakoModule);
        setJszip(jszipModule.default || jszipModule);

        setLibsLoaded(true);
        setMessage("Libraries loaded successfully. Ready to use!");
      } catch (error) {
        console.error("Error loading libraries:", error);
        setMessage(`Error loading libraries: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadLibraries();
  }, []);

  const triggerDownload = (bytes, fileName, mimeType = "application/octet-stream") => {
    try {
      const blob = new Blob([bytes], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setMessage(`✅ File "${fileName}" downloaded successfully.`);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage(`❌ Download failed: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
              aria-label="Loading spinner"
            ></div>
            <p className="text-white text-lg mt-6 font-semibold text-center px-4 max-w-xs">
              {message || "Processing..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the active PDF operation */}
      {Component && (
        <motion.div
          key={activeComponent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Component
            libsLoaded={libsLoaded}
            pdfLib={pdfLib}
            pdfjs={pdfjs}
            pakoLib={pakoLib}
            jszip={jszip}
            triggerDownload={triggerDownload}
            setMessage={setMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            activeComponent={activeComponent}
          />
        </motion.div>
      )}

      {/* Status Message */}
      {!isLoading && message && (
        <p className="mt-8 text-center text-gray-700 font-medium select-none">{message}</p>
      )}
    </div>
  );
}

export default PdfMain;
