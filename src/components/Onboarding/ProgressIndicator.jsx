import React from 'react';

const ProgressIndicator = ({ current, total }) => {
  return (
    <div className="w-full max-w-md mb-8">
      <div className="text-gray-700 mb-2">
        Step {current} of {total}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#1F4690] h-2 rounded-full"
          style={{ width: `${(current / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
