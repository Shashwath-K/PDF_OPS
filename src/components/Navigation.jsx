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
      
      {/* This logo link correctly points to "/" (the new Home Page) */}
      <NavLink 
        to="/" 
        className="nav-logo-group"
        onClick={handleLinkClick}
      >
        <img src={logo} alt="base_logo" className="nav-logo-img" />
        <span className="nav-logo-text">
          PDFnZIP
        </span>
      </NavLink>

      {/* --- Desktop Menu --- */}
      <ul className="nav-menu">
        <li className="nav-menu-item">
          
          {/* --- THIS IS THE FIX --- */}
          {/* The "Combine" link now points to "/combine" */}
          <NavLink
            to="/combine"
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

      {/* --- Mobile Menu & Toggle --- */}
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

      {/* Mobile slide-out menu */}
      <div className={`nav-mobile-menu ${isMenuOpen ? "open" : ""}`}>
        {/* --- THIS IS THE FIX --- */}
        <NavLink to="/combine" className="nav-mobile-link" onClick={handleLinkClick}>Combine</NavLink>
        <NavLink to="/compress" className="nav-mobile-link" onClick={handleLinkClick}>Compress</NavLink>
        <NavLink to="/zip" className="nav-mobile-link" onClick={handleLinkClick}>Zip Folder</NavLink>
        
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
      </div>
    </div>
  );
};

export default Navigation;