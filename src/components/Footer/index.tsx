// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* App Name */}
        <div className="text-lg font-semibold mb-4 md:mb-0">TommeTreasure</div>

        {/* Links */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link to="/about" className="hover:text-gray-300">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-gray-300">
            Terms of Service
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} TommeTreasure. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
