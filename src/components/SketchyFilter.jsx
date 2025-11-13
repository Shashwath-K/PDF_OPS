// src/components/SketchyFilter.jsx
import React from "react";
import { motion } from "framer-motion";

export const SketchyFilter = () => (
  <svg
    className="absolute"
    style={{ width: 0, height: 0, visibility: "hidden" }}
  >
    <defs>
      <filter id="sketchy">
        {/* This creates the "noise" or "grain" that will distort the icon.
          We animate 'baseFrequency' to make the grain "boil" or "wiggle"
          like a hand-drawn cartoon.
        */}
        <motion.feTurbulence
          type="fractalNoise"
          result="turbulence"
          numOctaves="1"
          // Animate the 'baseFrequency' to create the "boiling" effect
          animate={{
            baseFrequency: [0.03, 0.02, 0.04, 0.03],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        {/* This uses the "turbulence" noise to displace the pixels
          of the original icon, making the lines look sketchy.
        */}
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1.5" />
      </filter>
    </defs>
  </svg>
);