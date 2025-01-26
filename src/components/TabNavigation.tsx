import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const TabsNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { path: "/", label: "Onboarding Wizard" },
    { path: "/admin", label: "Admin" },
    { path: "/data", label: "Data" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative bg-gray-200 p-4">
      {/* Hamburger Icon for Mobile View */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="text-gray-800 focus:outline-none"
        >
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-6 justify-center">
        {tabs.map((tab, index) => (
          <NavLink
            key={index}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-2 rounded-lg text-lg font-semibold ${
                isActive ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`
            }
            end
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`absolute top-0 left-0 h-screen w-64 bg-gray-100 shadow-lg flex flex-col md:hidden z-50`}
      >
        {/* Close Button at the Top-Left Corner */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={toggleMenu}
            aria-label="Close menu"
            className="text-gray-800 focus:outline-none"
          >
            <HiOutlineX size={28} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              className={({ isActive }) =>
                `block mb-4 px-4 py-2 rounded-lg text-lg font-semibold ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`
              }
              onClick={() => setIsOpen(false)} // Close menu on navigation
              end
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </motion.div>

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default TabsNavigation;
