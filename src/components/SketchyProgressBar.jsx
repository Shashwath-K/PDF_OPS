// src/components/SketchyProgressBar.jsx
import React from "react";
import { motion } from "framer-motion";

export const SketchyProgressBar = ({ duration, color }) => (
  <div
    className="absolute bottom-0 left-0 w-full"
    style={{
      height: "8px",
      // Apply the pencil filter to the progress bar too!
      filter: "url(#sketchy)",
    }}
  >
    {/* This is the moving part of the bar */}
    <motion.div
      className="h-full"
      style={{
        backgroundColor: color,
        borderTopRightRadius: "4px",
        borderBottomRightRadius: "4px",
      }}
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{
        duration: duration / 1000,
        ease: "linear",
        delay: 0.1,
      }}
    />
  </div>
);