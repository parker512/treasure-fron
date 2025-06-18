// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom
import { PATHNAMES } from "../../constants/routes";
import useAuthStore from "../../store/auth-store";

const Header: React.FC = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const navigate = useNavigate();

  const handleLoginCick = () => {
    console.log("Login clicked");
    navigate(PATHNAMES.LOGIN);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    useAuthStore.getState().logout();
    navigate(PATHNAMES.HOME);
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
            Головна
          </Link>
          <Link to="/browse" className="hover:text-gray-300">
            Книги
          </Link>
          {isAuthorized && (
            <Link to="/add-book" className="hover:text-gray-300">
              Додати книгу
            </Link>
          )}
          {isAuthorized && (
            <Link to="/profile" className="hover:text-gray-300">
              Мій профіль
            </Link>
          )}
          {isAuthorized && (
            <Link to="/seller/orders" className="ml-4 text-gray-300">
              Мої замовлення
            </Link>
          )}
          {isAuthorized && (
            <Link to="/favorites" className="ml-4 text-gray-300">
              Обрані
            </Link>
          )}
        </div>

        {/* Search Bar and Login/Logout */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
          <button
            onClick={() => {
              isAuthorized ? handleLogoutClick() : handleLoginCick();
            }}
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
