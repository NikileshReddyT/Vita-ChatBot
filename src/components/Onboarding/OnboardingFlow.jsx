import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../../contexts/ChatContext';
import { saveUserData, loadUserData, clearUserData } from '../../utils/localStorage';

const questions = [
  {
    key: 'name',
    question: 'What is your name?',
    subtext: 'We\'ll use this to personalize your experience',
    placeholder: 'Enter your full name',
    type: 'text',
    required: true,
    validation: (value) => value.length >= 2 ? null : 'Name must be at least 2 characters long',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    key: 'age',
    question: 'How old are you?',
    subtext: 'This helps us provide age-appropriate health advice',
    placeholder: 'Enter your age',
    type: 'number',
    required: true,
    validation: (value) => {
      const age = parseInt(value);
      return (age >= 0 && age <= 120) ? null : 'Please enter a valid age between 0 and 120';
    },
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    key: 'gender',
    question: 'What is your gender?',
    subtext: 'For personalized health recommendations',
    type: 'select',
    options: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true,
    validation: (value) => value ? null : 'Please select a gender',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    key: 'conditions',
    question: 'Do you have any existing medical conditions?',
    subtext: 'This helps us provide more accurate health guidance',
    placeholder: 'List any medical conditions, or type "None"',
    type: 'textarea',
    required: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    key: 'medications',
    question: 'Are you currently taking any medications?',
    subtext: 'Including prescription and over-the-counter medications',
    placeholder: 'List current medications, or type "None"',
    type: 'textarea',
    required: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    key: 'concerns',
    question: 'What are your main health concerns or goals?',
    subtext: 'This helps us focus our conversation on what matters to you',
    placeholder: 'Describe your health concerns or wellness goals',
    type: 'textarea',
    required: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  }
];

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const { setUserData, startNewConversation } = useContext(ChatContext);
  const navigate = useNavigate();

  // Check for existing user data on mount
  useEffect(() => {
    const existingData = loadUserData();
    if (existingData) {
      setUserData(existingData);
      navigate('/chat');
    }
  }, [navigate, setUserData]);

  // Set initial value when step changes
  useEffect(() => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion) {
      setInputValue(responses[currentQuestion.key] || '');
      setError(null);
    }
  }, [currentStep, responses]);

  const validateInput = () => {
    const question = questions[currentStep];
    if (!question.required && !inputValue.trim()) return null;
    if (question.validation) {
      return question.validation(inputValue.trim());
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    const question = questions[currentStep];
    const newResponses = { ...responses, [question.key]: inputValue.trim() };
    setResponses(newResponses);
    setError(null);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user data and redirect
      saveUserData(newResponses);
      setUserData(newResponses);
      startNewConversation();
      navigate('/chat');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && questions[currentStep].type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSkip = () => {
    const confirmed = window.confirm(
      'Are you sure you want to skip the onboarding? This helps us provide better health recommendations.'
    );
    if (confirmed) {
      clearUserData();
      setUserData({});
      startNewConversation();
      navigate('/chat');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const renderInput = () => {
    const question = questions[currentStep];
    const commonClasses = `w-full px-4 py-3 rounded-lg border ${
      error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    } outline-none transition-all`;
    
    switch (question.type) {
      case 'select':
        return (
          <select
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            className={commonClasses}
          >
            <option value="">Select {question.key}</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            placeholder={question.placeholder}
            rows={4}
            className={`${commonClasses} resize-none`}
          />
        );
      default:
        return (
          <input
            type={question.type}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder={question.placeholder}
            className={commonClasses}
            autoFocus
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Vita Health</h1>
          <p className="text-gray-600">Let's personalize your health journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {currentStep + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              {questions[currentStep].icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {questions[currentStep].question}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {questions[currentStep].subtext}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {renderInput()}
            
            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 mt-2">
                {error}
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Skip Onboarding
                </button>
              </div>
              <button
                onClick={handleNext}
                disabled={questions[currentStep].required && !inputValue.trim()}
                className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                  !questions[currentStep].required || inputValue.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                {currentStep === questions.length - 1 ? 'Start Chat' : 'Next'}
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm">
          Your privacy is important to us. Your information helps us provide better health recommendations.
          <br />
          You can always update these details later from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingFlow;
