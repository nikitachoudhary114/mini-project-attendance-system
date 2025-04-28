import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Attendance Monitoring System. All rights
          reserved.
        </p>
        <p className="text-sm mt-2">
          Made by <span className="font-bold">Nikita, Shivani, Ayush</span>
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a
            href="#"
            className="hover:text-gray-300 transition-colors"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.917c-1.504 0-1.796.715-1.796 1.763v2.31h3.591l-.467 3.622h-3.124V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.573 4.897 4.897 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.918 4.918 0 004.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-gray-300 transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.23 0H1.77C.792 0 0 .774 0 1.727v20.546C0 23.226.792 24 1.77 24h20.46c.978 0 1.77-.774 1.77-1.727V1.727C24 .774 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.452a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM20.452 20.452h-3.56v-5.6c0-1.337-.027-3.06-1.865-3.06-1.865 0-2.15 1.457-2.15 2.963v5.697h-3.56V9h3.415v1.561h.05c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.372 4.27 5.457v6.284z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
