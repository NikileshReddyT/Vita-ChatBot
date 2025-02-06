import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
        <svg
          className="h-5 w-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <div className="flex space-x-1">
        <div
          className="h-3 w-3 rounded-full bg-blue-600"
          style={{
            animation: "typingDot 1.4s infinite ease-in-out",
            animationDelay: "0s"
          }}
        ></div>
        <div
          className="h-3 w-3 rounded-full bg-blue-600"
          style={{
            animation: "typingDot 1.4s infinite ease-in-out",
            animationDelay: "0.2s"
          }}
        ></div>
        <div
          className="h-3 w-3 rounded-full bg-blue-600"
          style={{
            animation: "typingDot 1.4s infinite ease-in-out",
            animationDelay: "0.4s"
          }}
        ></div>
      </div>
      <span className="text-sm text-gray-500">Vita is typing...</span>
      {/* Custom keyframes defined inline using styled-jsx */}
      <style jsx>{`
        @keyframes typingDot {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
