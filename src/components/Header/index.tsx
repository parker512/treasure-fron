// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom
import { PATHNAMES } from "../../constants/routes";
import useAuthStore from "../../store/auth-store";

const Header: React.FC = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const navigate = useNavigate();

  const handleLoginCick = () => {
    navigate(PATHNAMES.LOGIN);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold mb-2 md:mb-0">
          TommeTreasure
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/browse" className="hover:text-gray-300">
            Browse Books
          </Link>
          {isAuthorized && (
            <Link to="/add-book" className="hover:text-gray-300">
              Add Book
            </Link>
          )}
          {isAuthorized && (
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          )}
          {isAuthorized && (
            <Link
              to="/seller/orders"
              className="ml-4 text-gray-900 hover:text-blue-600"
            >
              Мои заказы
            </Link>
          )}
        </div>

        {/* Search Bar and Login/Logout */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search books..."
            className="p-2 rounded-md text-black w-full md:w-64"
          />
          <button
            onClick={() => handleLoginCick()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-full md:w-auto"
          >
            {isAuthorized ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
