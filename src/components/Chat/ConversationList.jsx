import React, { useState, useEffect } from 'react';
import { getAllConversations, deleteConversation } from '../../utils/localStorage';

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const convos = getAllConversations();
    setConversations(convos);
  }, []);

  const handleDelete = (id) => {
    deleteConversation(id);
    setConversations(getAllConversations());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations saved.</p>
      ) : (
        <ul>
          {conversations.map((conv) => (
            <li key={conv.id} className="mb-2 flex justify-between items-center">
              <span>{conv.data.userData?.name || conv.id}</span>
              <button onClick={() => handleDelete(conv.id)} className="text-red-500 text-sm">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
