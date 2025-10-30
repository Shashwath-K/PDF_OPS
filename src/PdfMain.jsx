// PdfMain.jsx
import React, { useEffect, useState } from "react";

function PdfMain({ Component, activeComponent }) {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Loading required PDF libraries...");

  const [libsLoaded, setLibsLoaded] = useState(false);
  const [pdfLib, setPdfLib] = useState(null);
  const [pdfjs, setPdfjs] = useState(null);
  const [pakoLib, setPakoLib] = useState(null);
  const [jszip, setJszip] = useState(null);

  // Load libraries dynamically
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        setIsLoading(true);
        setMessage("Loading PDF libraries...");

        const [pdfLibModule, pdfjsModule, pakoModule, jszipModule] = await Promise.all([
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
        setJszip(jszipModule);

        setLibsLoaded(true);
        setMessage("Libraries loaded successfully. Ready to use!");
      } catch (e) {
        console.error("Error loading libraries:", e);
        setMessage(`Error loading libraries: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadLibraries();
  }, []);

  /** Trigger browser file download */
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
    } catch (e) {
      console.error("Download failed:", e);
      setMessage(`❌ Download failed: ${e.message}`);
    }
  };

  const uiDisabled = isLoading || !libsLoaded;

  const styles = {
    loader: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin",
  };

  return (
    <div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-50">
          <div className={styles.loader}></div>
          <p className="text-white text-lg mt-4">{message || "Processing..."}</p>
        </div>
      )}

      {/* Render the active operation */}
      {Component && (
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
        />
      )}

      {/* Message */}
      {message && !isLoading && (
        <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}

export default PdfMain;
