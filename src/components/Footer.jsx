import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Use .layout-container to perfectly align the footer content 
        with the main content's horizontal padding.
      */}
      <div className="layout-container text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-primary-700 dark:text-primary-400">
            PDF-OPS
          </span>
          . All rights reserved.
        </p>
        <p className="mt-2">
          A utility tool built with React, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;