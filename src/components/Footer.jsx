import React from "react";

const Footer = () => {
  return (
    // 1. Use the .app-footer class
    <footer className="app-footer">
      
      {/* 2. Use the .container class to center the content */}
      <div className="container">
        
        {/* 3. Use new semantic classes for the text */}
        <p className="footer-text">
          &copy; {new Date().getFullYear()}{" "}
          
          {/* 4. Use a specific class for the brand name */}
          <span className="footer-brand">
            PDF-OPS
          </span>
          . All rights reserved.
        </p>
        
        <p className="footer-text">
          A utility tool built with React, CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;