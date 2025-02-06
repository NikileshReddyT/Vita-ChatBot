import React, { useState } from 'react';

const Question = ({ question, fieldKey, onNext }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() === '') return;
    onNext(fieldKey, answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="block text-2xl font-medium text-gray-900 mb-4">
        {question}
      </label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Your answer..."
        autoFocus
      />
      <button type="submit" className="btn-primary w-full py-2">
        Next
      </button>
    </form>
  );
};

export default Question;
