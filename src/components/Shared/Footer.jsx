import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 p-4 text-center">
      &copy; {new Date().getFullYear()} Medical Chatbot. All rights reserved.
    </footer>
  );
};

export default Footer;
