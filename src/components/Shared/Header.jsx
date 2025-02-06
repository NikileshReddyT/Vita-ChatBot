// src/components/Shared/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-[#1F4690]">
          Vital Health ChatBot
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/chat" className="text-lg text-[#3A5BA0] hover:text-[#1F4690] transition duration-300">
                Chat Now
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-lg text-[#3A5BA0] hover:text-[#1F4690] transition duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-lg text-[#3A5BA0] hover:text-[#1F4690] transition duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
