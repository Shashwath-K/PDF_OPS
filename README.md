# PDF-OPS

PDF-OPS is a client-side web application built with React, designed to perform common PDF operations. It provides a clean, responsive, and animated interface for merging, compressing, and zipping PDF files and folders directly in the browser.

> All operations are performed entirely on the client-side. No files are ever uploaded to a server, ensuring user privacy and speed.

## Project Structure
```
src/
├── components/
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   ├── WelcomeLoader.jsx
│   └── ScrollToTop.jsx   
├── layouts/
│   └── PdfMain.jsx       
├── pages/
│   ├── PdfCombine.jsx
│   ├── PdfCompress.jsx
│   └── ZipFolder.jsx
├── App.jsx
├── App.css
└── index.js
```
## Features

- **Combine PDFs:** Merge multiple PDF documents into a single, combined file.
- **Process PDFs:** Apply basic compression or flatten form fields to make them non-editable.
- **Zip Folder:** Upload an entire folder and download its complete contents (including sub-folders) as a single .zip file.
- **Smart Downloading:** Downloads a single processed file as a PDF, but automatically zips the output if two or more files are processed at once.
- **Dark/Light Mode:** Includes a fully-responsive, theme-aware UI with a toggle.
- **Custom Loader:** A unique, "funky" pencil-drawn-style loading animation using custom SVG icons and filters.
- **Drag-and-Drop:** A reusable, intuitive file dropzone for all operations.

## Tech Stack

- **Core:** React
- **Routing:** React Router v6
- **Animation:** Framer Motion (for page transitions, the loader, and UI animations)
- **Styling:** A 700+ line custom CSS file (`App.css`) with CSS variables, dark mode, and a responsive flexbox layout.
- **PDF Logic:** `pdf-lib` (for merging, flattening, and object stream compression)
- **Zipping Logic:** `jszip` (for zipping folders and multiple file outputs)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

## Core Functionality Notes
#### A Note on "Compression"
<p>The "compression" in this project is client-side and limited to what pdf-lib can perform. This includes using object streams and flattening forms.</p>

- This tool cannot re-sample or re-compress images (e.g., change DPI), which is where most file-size reduction in professional tools comes from.

- For this reason, the "Compress (Use Object Streams)" option may not significantly reduce the size of already-optimized PDFs and, in some cases, may slightly increase it. Its primary function is to restructure the file, while "Flatten" makes for
