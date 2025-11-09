// Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="text-center text-gray-400 py-4 mt-8 border-t">
      &copy; {new Date().getFullYear()} PDF Toolkit – All rights reserved.
    </footer>
  );
}
