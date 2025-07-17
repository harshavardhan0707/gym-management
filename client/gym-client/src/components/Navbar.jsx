import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-lg border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight select-none drop-shadow">FitAdmin</span>
        </div>
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button
            className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-2xl text-blue-700 font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-white transition"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Profile menu"
          >
            👤
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-12 w-40 bg-white rounded-xl shadow-xl border border-blue-100 py-2 animate-fade-in z-50">
              <Link
                to="/admin-profile"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium rounded-t-xl"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium rounded-b-xl"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
