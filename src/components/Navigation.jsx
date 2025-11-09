// Navigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const navClasses = ({ isActive }) =>
  `py-2 px-4 cursor-pointer text-lg transition-all ${
    isActive
      ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
      : "text-gray-500 hover:bg-gray-100"
  }`;

export default function Navigation() {
  return (
    <nav className="flex border-b mb-4 justify-center gap-4">
      <NavLink to="/" end className={navClasses}>
        Combine PDFs
      </NavLink>
      <NavLink to="/compress" className={navClasses}>
        Compress PDF
      </NavLink>
      <NavLink to="/zip" className={navClasses}>
        Compress Folder (ZIP)
      </NavLink>
    </nav>
  );
}
