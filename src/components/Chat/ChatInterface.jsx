// src/components/Chat/ChatInterface.jsx
import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Sidebar from '../Sidebar/Sidebar';

const ChatInterface = () => {
  const { 
    conversation, 
    loading, 
    userData,
    currentConversationId 
  } = useContext(ChatContext);
  
  const messagesEndRef = useRef(null);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {userData?.name ? `Chat with ${userData.name}` : 'Vita Health Assistant'}
              </h1>
              <p className="text-sm text-gray-500">
                {currentConversationId ? 'Conversation #' + currentConversationId.slice(0, 8) : 'New conversation'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-b from-gray-50 to-white">
          {conversation.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to Vita Health</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I'm your personal health assistant, trained to provide accurate health information and guidance. 
                  Feel free to ask me anything about health, wellness, or medical information.
                </p>
                <div className="space-y-3 text-left bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-900 font-medium">Try asking about:</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                      </svg>
                      General health advice and tips
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                      </svg>
                      Symptoms and conditions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                      </svg>
                      Lifestyle and wellness recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {conversation.map((msg, index) => (
                <div key={msg.id} className={`animate-fade-in ${loading && index === conversation.length - 1 ? 'opacity-50' : ''}`}>
                  <MessageBubble message={msg} isFirst={index === 0} />
                </div>
              ))}
              <div ref={messagesEndRef} />
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="px-8 py-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
