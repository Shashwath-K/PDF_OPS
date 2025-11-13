// src/components/DoodleIcon.jsx
import React from "react";
import { motion } from "framer-motion";

export const DoodleIcon = ({
  children,
  top,
  left,
  x,
  y,
  rotate,
  delay,
}) => (
  <motion.div
    className="absolute"
    style={{
      top: top,
      left: left,
      // This applies the "pencil" filter from the SVG definition
      filter: "url(#sketchy)",
    }}
    initial={{ opacity: 0, x: x, y: y, rotate: rotate, scale: 0.5 }}
    animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
    transition={{
      delay: delay,
      duration: 1.2,
      // This is an "overshoot" easing, which feels "funky"
      ease: [0.34, 1.56, 0.64, 1],
    }}
  >
    {children}
  </motion.div>
);