import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

// Accept the theme props from App.jsx
const Navigation = ({ toggleTheme, currentTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    // The .container class centers our nav content
    <div className="container">
      {/* .nav-header contains the logo and the mobile toggle */}
      <div className="nav-header">
        <NavLink 
          to="/" 
          className="nav-logo" 
          onClick={handleLinkClick}
        >
          PDF-OPS
        </NavLink>

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button
          className={`nav-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span className="nav-toggle-bar bar-1"></span>
          <span className="nav-toggle-bar bar-2"></span>
          <span className="nav-toggle-bar bar-3"></span>
        </button>
      </div>

      {/* Navigation Menu (Links + Theme Toggle) */}
      <ul className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <li className="nav-menu-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            Combine
          </NavLink>
        </li>
        <li className="nav-menu-item">
          <NavLink
            to="/compress"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            Compress
          </NavLink>
        </li>
        <li className="nav-menu-item">
          <NavLink
            to="/zip"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            Zip Folder
          </NavLink>
        </li>

        {/* --- Theme Toggle Button --- */}
        <li className="nav-menu-item">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {currentTheme === "light" ? (
              <MoonIcon className="icon" />
            ) : (
              <SunIcon className="icon" />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;