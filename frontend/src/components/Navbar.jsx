import React from "react";

const Navbar = () => {
const handleLogout = () => {
  // Remove the token from localStorage
  localStorage.removeItem("token");

  // Redirect to the login page
  window.location.href = "/";
};
  
  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:opacity-90">
            Attendance System
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/dashboard" className="hover:underline">
            Dashboard
          </a>
          <a href="/question-data" className="hover:underline">
            Previous questions
          </a>
          <a href="/attendance-data" className="hover:underline">
            Attendance sheet
          </a>
          <button
            onClick={handleLogout}
            className="hover:underline focus:outline-none"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
