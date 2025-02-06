import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage/LandingPage';
import ChatInterface from '../components/Chat/ChatInterface';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import { useContext } from 'react';
import { ChatContext, ChatProvider } from '../contexts/ChatContext';

const ProtectedChatRoute = () => {
  const { userData } = useContext(ChatContext);
  return userData ? <ChatInterface /> : <Navigate to="/onboarding" replace />;
};

const AppRoutes = () => {
  return (
 
      <ChatProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ProtectedChatRoute />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/chat-session" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ChatProvider>
  );
};

export default AppRoutes;
