import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import ErrorBoundary from './components/Shared/ErrorBoundary';

const AppContent = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes('/chat');

  return (
    <>
      {!isChatRoute && <Header />}
      <main className={`${isChatRoute ? 'h-screen' : 'min-h-screen'}`}>
        <AppRoutes />
      </main>
      {!isChatRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </Router>
      </ChatProvider>
    </ErrorBoundary>
  );
}

export default App;
