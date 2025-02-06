import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChatContext } from '../../contexts/ChatContext';
import { getAllConversations, deleteConversation } from '../../utils/localStorage';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    userData, 
    conversation, 
    currentConversationId,
    startNewConversation,
    loadExistingConversation 
  } = useContext(ChatContext);

  // Load conversations on mount and when they change
  useEffect(() => {
    const loadConversations = () => {
      const convos = getAllConversations();
      setConversations(convos.sort((a, b) => b.data.timestamp - a.data.timestamp));
    };
    loadConversations();

    // Set up interval to refresh conversations
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.data.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(conv.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.data.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, e) => {
    e.preventDefault(); // Prevent the Link from being clicked
    e.stopPropagation(); // Prevent event bubbling
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
      setConversations(getAllConversations());
      
      // If we're deleting the current conversation, navigate to a new chat
      if (currentConversationId === id) {
        startNewConversation();
        navigate('/chat');
      }
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    navigate('/chat');
  };

  const handleSelectConversation = (conv) => {
    loadExistingConversation(conv.id);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
        isOpen ? 'w-80' : 'w-20'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all z-10"
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">Conversations</h2>
                <p className="text-sm text-gray-500">Your chat history</p>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {isOpen && (
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              {isOpen && (
                <>
                  <p className="text-gray-900 font-medium">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchTerm ? 'No matches found' : 'Start chatting to see your history'}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="py-3">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="group relative"
                >
                  <Link
                    to={`/chat?id=${conv.id}`}
                    onClick={() => handleSelectConversation(conv)}
                    className={`flex items-center px-4 py-3 space-x-3 hover:bg-gray-50 ${
                      currentConversationId === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conv.data.userData?.name || `Chat ${conv.id.slice(0, 8)}`}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conv.data.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {conv.data.lastMessage || 'Start a new conversation'}
                        </p>
                      </div>
                    )}
                  </Link>
                  {isOpen && (
                    <button
                      onClick={(e) => handleDelete(conv.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete conversation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Chat Button */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
