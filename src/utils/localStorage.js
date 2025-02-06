// Conversation Storage
export const saveConversation = (conversationId, conversationData) => {
  try {
    localStorage.setItem(`chat_${conversationId}`, JSON.stringify(conversationData));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
};

export const loadConversation = (conversationId) => {
  try {
    const data = localStorage.getItem(`chat_${conversationId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading conversation:', error);
    return null;
  }
};

export const deleteConversation = (conversationId) => {
  try {
    localStorage.removeItem(`chat_${conversationId}`);
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};

export const getAllConversations = () => {
  try {
    const conversations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsedData = JSON.parse(data);
            conversations.push({
              id: key.replace('chat_', ''),
              data: parsedData
            });
          }
        } catch (parseError) {
          console.error(`Error parsing conversation data for key ${key}:`, parseError);
          // Remove invalid data
          localStorage.removeItem(key);
        }
      }
    }
    return conversations;
  } catch (error) {
    console.error('Error getting all conversations:', error);
    return [];
  }
};

// User Data Storage
export const saveUserData = (userData) => {
  try {
    localStorage.setItem('user_data', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const loadUserData = () => {
  try {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const clearUserData = () => {
  try {
    localStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const clearAllData = () => {
  try {
    // Iterate backwards to avoid issues as localStorage length changes.
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('chat_') || key === 'user_data')) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
