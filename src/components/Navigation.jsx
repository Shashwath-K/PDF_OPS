import React from "react";
// --- 1. Use NavLink, and DO NOT import BrowserRouter ---
import { NavLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // (Install @heroicons/react for this)

// --- 2. Accept the theme props from App.jsx ---
const Navigation = ({ toggleTheme, currentTheme }) => {
  const commonLinkClass =
    "font-medium rounded-md px-3 py-1 transition-all duration-150";
  const activeLinkClass =
    "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100";
  const inactiveLinkClass =
    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

  return (
    // --- 3. NO <Router> wrapper here! Just the <nav> ---
    <nav className="flex justify-center items-center gap-4 mt-2">
      <NavLink
        to="/"
        // This className function makes NavLink work
        className={({ isActive }) =>
          `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        Combine
      </NavLink>
      <NavLink
        to="/compress"
        className={({ isActive }) =>
          `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        Compress
      </NavLink>
      <NavLink
        to="/zip"
        className={({ isActive }) =>
          `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        Zip Folder
      </NavLink>

      {/* --- 4. Added the theme toggle button --- */}
      <button
        onClick={toggleTheme}
        className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
        aria-label="Toggle theme"
      >
        {currentTheme === "light" ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </button>
    </nav>
  );
};

export default Navigation;