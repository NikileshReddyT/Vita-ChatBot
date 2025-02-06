import React from 'react';

const CTAButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="btn-primary text-xl font-semibold transition duration-300 hover:bg-[#3A5BA0]"
    >
      {label}
    </button>
  );
};

export default CTAButton;
