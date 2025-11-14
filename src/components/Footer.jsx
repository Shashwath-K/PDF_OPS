// src/components/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    // This parent class is already correct
    <footer className="app-footer">
      
      {/* This container is also correct */}
      <div className="container">
        
        {/* These classNames are the most important part */}
        <p className="footer-text">
          <span className="footer-brand">
            &copy; ProjectLima {new Date().getFullYear()}{" "}
          </span>
        </p>
        <p className="footer-text">
          A utility tool built with React, CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;