import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()}{" "}
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