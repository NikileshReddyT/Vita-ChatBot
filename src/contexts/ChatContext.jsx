import React, { createContext, useState, useEffect } from 'react';
import { sendMessageToGemini, startNewSession } from '../api/geminiAPI';
import { 
  saveConversation, 
  loadConversation, 
  getAllConversations, 
  deleteConversation 
} from '../utils/localStorage';

export const ChatContext = createContext();

// Health-related keywords to help generate better titles
const HEALTH_CATEGORIES = {
  EMERGENCY: {
    keywords: ['emergency', 'urgent', 'severe', 'extreme', 'critical', 'immediate'],
    icon: '🚨',
    style: 'emergency'
  },
  CHRONIC: {
    keywords: ['diabetes', 'arthritis', 'asthma', 'hypertension', 'chronic'],
    icon: '⚕️',
    style: 'chronic'
  },
  MENTAL_HEALTH: {
    keywords: ['anxiety', 'depression', 'stress', 'mental', 'mood', 'sleep'],
    icon: '🧠',
    style: 'mental'
  },
  LIFESTYLE: {
    keywords: ['diet', 'exercise', 'nutrition', 'fitness', 'weight', 'lifestyle'],
    icon: '🌱',
    style: 'lifestyle'
  },
  FOLLOWUP: {
    keywords: ['follow', 'checkup', 'review', 'progress', 'monitoring'],
    icon: '📋',
    style: 'followup'
  },
  MEDICATION: {
    keywords: ['medicine', 'drug', 'prescription', 'dosage', 'medication'],
    icon: '💊',
    style: 'medication'
  },
  SYMPTOMS: {
    keywords: ['pain', 'fever', 'cough', 'headache', 'nausea', 'symptoms'],
    icon: '🔍',
    style: 'symptoms'
  },
  CONSULTATION: {
    keywords: ['advice', 'question', 'consult', 'opinion', 'guidance'],
    icon: '👨‍⚕️',
    style: 'consultation'
  }
};

const BODY_PARTS = {
  HEAD: ['head', 'brain', 'skull', 'face'],
  CHEST: ['chest', 'heart', 'lung', 'breast'],
  ABDOMEN: ['stomach', 'abdomen', 'digestive'],
  LIMBS: ['arm', 'leg', 'hand', 'foot'],
  JOINTS: ['joint', 'knee', 'elbow', 'shoulder'],
  SKIN: ['skin', 'rash', 'dermis']
};

export const ChatProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  // Generate a smart title based on message content
  const generateConversationTitle = (message) => {
    const lowercaseMsg = message.toLowerCase();
    const words = lowercaseMsg.split(' ');
    
    // Detect categories
    let mainCategory = null;
    let subCategories = [];
    let bodyPart = null;
    
    // Find main category
    for (const [category, data] of Object.entries(HEALTH_CATEGORIES)) {
      for (const keyword of data.keywords) {
        if (lowercaseMsg.includes(keyword)) {
          if (!mainCategory || category === 'EMERGENCY') {
            mainCategory = { name: category, ...data };
          } else {
            subCategories.push({ name: category, ...data });
          }
          break;
        }
      }
    }
    
    // Find body part if mentioned
    for (const [part, keywords] of Object.entries(BODY_PARTS)) {
      if (keywords.some(keyword => lowercaseMsg.includes(keyword))) {
        bodyPart = part.toLowerCase();
        break;
      }
    }
    
    // If no main category found, use CONSULTATION
    if (!mainCategory) {
      mainCategory = HEALTH_CATEGORIES.CONSULTATION;
    }
    
    // Extract key phrases (2-3 word combinations that might be meaningful)
    const keyPhrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 3 && words[i + 1].length > 3) {
        keyPhrases.push(words[i] + ' ' + words[i + 1]);
      }
    }
    
    // Build the title
    let title = mainCategory.icon + ' ';
    
    // Add body part if found
    if (bodyPart) {
      title += bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1) + ' • ';
    }
    
    // Add a key phrase if found
    if (keyPhrases.length > 0) {
      const phrase = keyPhrases[0].split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      title += phrase + ' ';
    }
    
    // Add subcategory icons if any
    if (subCategories.length > 0) {
      title += subCategories.slice(0, 2)
        .map(cat => cat.icon)
        .join(' ');
    }
    
    // Add severity indicator for emergency
    if (mainCategory.name === 'EMERGENCY') {
      title = '🚨 URGENT: ' + title;
    }
    
    return {
      title: title.trim(),
      category: mainCategory.name,
      style: mainCategory.style,
      subCategories: subCategories.map(cat => cat.name),
      bodyPart: bodyPart
    };
  };

  const loadConversations = () => {
    const loadedConversations = getAllConversations()
      .sort((a, b) => new Date(b.data.lastUpdated) - new Date(a.data.lastUpdated));
    setConversations(loadedConversations);
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setConversation([]);
    startNewSession();
  };

  const loadExistingConversation = (conversationId) => {
    const loadedConversation = loadConversation(conversationId);
    if (loadedConversation) {
      setCurrentConversationId(conversationId);
      setConversation(loadedConversation.messages || []);
      startNewSession();
    }
  };

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      const updatedConversation = [...conversation, userMessage];
      setConversation(updatedConversation);

      // Generate conversation name from first message if this is a new conversation
      let conversationId = currentConversationId;
      let conversationTitle;
      
      if (!conversationId) {
        const { title, category } = generateConversationTitle(message);
        conversationId = `chat_${Date.now()}`;
        conversationTitle = title;
        setCurrentConversationId(conversationId);
      }

      const response = await sendMessageToGemini({
        message,
        context: userData || {}
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      const finalConversation = [...updatedConversation, botMessage];
      setConversation(finalConversation);

      // Save to localStorage with the smart title
      const conversationData = {
        id: conversationId,
        name: conversationTitle || conversations.find(c => c.id === conversationId)?.data?.name,
        messages: finalConversation,
        lastUpdated: new Date().toISOString()
      };
      
      saveConversation(conversationId, conversationData);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentConversation = () => {
    if (currentConversationId) {
      deleteConversation(currentConversationId);
      loadConversations();
      startNewConversation();
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversation,
        loading,
        sendMessage,
        currentConversationId,
        conversations,
        startNewConversation,
        loadExistingConversation,
        deleteCurrentConversation,
        userData,
        setUserData
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
