// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white bg-opacity-80 backdrop-blur-md border-t border-gray-200 py-4 mt-10 select-none text-center text-gray-500 text-sm font-medium"
    >
      © {new Date().getFullYear()} PDF Toolkit & Zipper. Made with ♥️.
    </motion.footer>
  );
};

export default Footer;
