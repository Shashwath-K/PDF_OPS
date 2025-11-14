import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import logo from "../assets/logo/mini-logo-ext.png";

const Navigation = ({ toggleTheme, currentTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="container nav-container">
      
      {/* 2. Replaced the old NavLink with this new logo group */}
      <div className="nav-logo-group">
        <NavLink 
          to="/" 
          className="nav-logo-link"
          onClick={handleLinkClick}
        >
          <img src={logo} alt="base_logo" className="nav-logo-img" />
        </NavLink>
        {/* 3. Added the new placeholder text */}
        <span className="nav-logo-text">
          PDFnZIP
        </span>
      </div>

      {/* --- Desktop Menu (hidden on mobile) --- */}
      <ul className="nav-menu">
        <li className="nav-menu-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "active" : ""}`
            }
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
          >
            Zip Folder
          </NavLink>
        </li>
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

      {/* --- Mobile Menu & Toggle (hidden on desktop) --- */}
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

      {/* This is the slide-out menu for mobile */}
      <div className={`nav-mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-mobile-link" onClick={handleLinkClick}>Combine</NavLink>
        <NavLink to="/compress" className="nav-mobile-link" onClick={handleLinkClick}>Compress</NavLink>
        <NavLink to="/zip" className="nav-mobile-link" onClick={handleLinkClick}>Zip Folder</NavLink>
      </div>
    </div>
  );
};

export default Navigation;