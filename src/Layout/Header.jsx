import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the tokens by expiring the cookies
    document.cookie = "Access_token=; path=/; max-age=0";
    document.cookie = "Refress_token=; path=/; max-age=0";
    navigate("/login");
  };

  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Khet Connect</h1>

      <ul className="flex space-x-6 mx-auto">
        <li>
          <NavLink
            to="/"
            className={`hover:text-gray-300 ${
              location.pathname === "/" ? "text-green-400 font-bold" : ""
            }`}
          >
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/product"
            className={`hover:text-gray-300 ${
              location.pathname === "/product" ? "text-green-400 font-bold" : ""
            }`}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/farmers"
            className={`hover:text-gray-300 ${
              location.pathname === "/farmers" ? "text-green-400 font-bold" : ""
            }`}
          >
            Farmers
          </NavLink>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium"
      >
        Logout
      </button>
    </nav>
  );
};

export default Header;
