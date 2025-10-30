// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import PdfCombine from "./PdfCombine";
import PdfCompress from "./PdfCompress";
import ZipFolder from "./ZipFolder";

function App() {
  const [activeTab, setActiveTab] = useState("combine");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Loading required PDF libraries...");

  // Libraries
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [pdfLib, setPdfLib] = useState(null);
  const [pdfjs, setPdfjs] = useState(null);
  const [pakoLib, setPakoLib] = useState(null);
  const [jszip, setJszip] = useState(null);

  // Dynamically load libraries once
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
        setMessage("Libraries loaded successfully. Please select your files.");
      } catch (e) {
        console.error("Error loading libraries:", e);
        setMessage(`Error: Could not load required libraries. ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadLibraries();
  }, []);

  /** Helper: Trigger file download in browser */
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
      setMessage(`Success! File "${fileName}" has been downloaded.`);
    } catch (e) {
      console.error("Download failed:", e);
      setMessage(`Error: Could not download file. ${e.message}`);
    }
  };

  const styles = {
    container:
      "max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 font-sans relative",
    tabs: "flex border-b mb-4",
    tab: (isActive) =>
      `py-2 px-4 cursor-pointer text-lg ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
          : "text-gray-500 hover:bg-gray-100"
      }`,
    tabContent: "p-4 border border-t-0 rounded-b-lg",
    loader: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin",
  };

  const uiDisabled = isLoading || !libsLoaded;

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">PDF Toolkit</h1>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-50">
          <div className={styles.loader}></div>
          <p className="text-white text-lg mt-4">{message || "Processing..."}</p>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <div
          className={styles.tab(activeTab === "combine")}
          onClick={() => !uiDisabled && setActiveTab("combine")}
        >
          Combine PDFs
        </div>
        <div
          className={styles.tab(activeTab === "compress")}
          onClick={() => !uiDisabled && setActiveTab("compress")}
        >
          Compress PDF
        </div>
        <div
          className={styles.tab(activeTab === "zip")}
          onClick={() => !uiDisabled && setActiveTab("zip")}
        >
          Compress Folder (ZIP)
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "combine" && (
          <PdfCombine
            libsLoaded={libsLoaded}
            pdfLib={pdfLib}
            pakoLib={pakoLib}
            triggerDownload={triggerDownload}
            setMessage={setMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}

        {activeTab === "compress" && (
          <PdfCompress
            libsLoaded={libsLoaded}
            pdfLib={pdfLib}
            pdfjs={pdfjs}
            pakoLib={pakoLib}
            triggerDownload={triggerDownload}
            setMessage={setMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}

        {activeTab === "zip" && (
          <ZipFolder
            libsLoaded={libsLoaded}
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
    </div>
  );
}

export default App;
