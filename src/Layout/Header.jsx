import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

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
    </nav>
  );
};

export default Header;
