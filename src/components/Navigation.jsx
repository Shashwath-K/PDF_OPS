import React from "react";
import { NavLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

// Accept the props from App.jsx
const Navigation = ({ toggleTheme, currentTheme }) => {
  // Define classes for NavLink to keep the return statement clean
  const commonLinkClass =
    "font-medium rounded-lg px-3 py-2 transition-colors duration-200";
  const activeLinkClass =
    "bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100";
  const inactiveLinkClass =
    "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

  return (
    <nav className="flex justify-center items-center gap-2 sm:gap-4 mt-4">
      <NavLink
        to="/"
        // This function checks if the link is active
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

      {/* --- Theme Toggle Button --- */}
      <button
        onClick={toggleTheme}
        className="ml-4 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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