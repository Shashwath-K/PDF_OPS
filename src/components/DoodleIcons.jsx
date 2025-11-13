// src/components/DoodleIcons.jsx
import React from "react";

/* These are all the "doodle" icons.
  They are standard SVGs but drawn to be simple, with round line caps/joins
  to look like they were drawn with a marker or pencil.
  They all use 'currentColor' so their color is inherited from the parent.
*/

const commonProps = {
  viewBox: "0 0 64 64",
  width: "100",
  height: "100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const FileIcon = () => (
  <svg {...commonProps}>
    <path d="M38.5 8H14.1C13 8 12 9 12 10.1v43.8c0 1.1.9 2.1 2.1 2.1h35.8c1.1 0 2.1-.9 2.1-2.1V22.1L38.5 8z" />
    <polyline points="37.5 9 37.5 22.5 51 22.5" />
  </svg>
);

export const FolderIcon = () => (
  <svg {...commonProps}>
    <path d="M52.1 18.2H31.5l-6.2-4.1H11.9c-1.1 0-2.1.9-2.1 2.1v29.6c0 1.1.9 2.1 2.1 2.1h40.2c1.1 0 2.1-.9 2.1-2.1V20.3c0-1.1-.9-2.1-2.1-2.1z" />
  </svg>
);

export const DocumentIcon = () => (
  <svg {...commonProps}>
    <path d="M14 10h36v44H14z" />
    <line x1="20" y1="20" x2="44" y2="20" />
    <line x1="20" y1="28" x2="44" y2="28" />
    <line x1="20" y1="36" x2="44" y2="36" />
    <line x1="20" y1="44" x2="36" y2="44" />
  </svg>
);

export const WebIcon = () => (
  <svg {...commonProps}>
    <circle cx="32" cy="32" r="22" />
    <line x1="10" y1="32" x2="54" y2="32" />
    <path d="M32 10c-8 0-14 9.8-14 22s6 22 14 22 14-9.8 14-22-6-22-14-22z" />
  </svg>
);

export const ImageIcon = () => (
  <svg {...commonProps}>
    <rect x="10" y="10" width="44" height="44" rx="2" ry="2" />
    <circle cx="23" cy="22" r="4" />
    <polyline points="18 42 28 32 46 50" />
  </svg>
);

// --- THIS IS THE MISSING EXPORT ---
export const CodeIcon = () => (
  <svg {...commonProps}>
    <polyline points="24 18 14 30 24 42" />
    <polyline points="40 18 50 30 40 42" />
  </svg>
);
// ----------------------------------

export const ZipIcon = () => (
  <svg {...commonProps}>
    <path d="M38.5 8H14.1C13 8 12 9 12 10.1v43.8c0 1.1.9 2.1 2.1 2.1h35.8c1.1 0 2.1-.9 2.1-2.1V22.1L38.5 8z" />
    <line x1="32" y1="28" x2="32" y2="54" />
    <line x1="32" y1="28" x2="26" y2="28" />
    <line x1="26" y1="32" x2="32" y2="32" />
    <line x1="32" y1="36" x2="26" y2="36" />
    <line x1="26" y1="40" x2="32" y2="40" />
    <line x1="32" y1="44" x2="26" y2="44" />
    <line x1="26" y1="48" x2="32" y2="48" />
  </svg>
);