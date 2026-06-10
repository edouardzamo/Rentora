// frontend/src/api/messageApi.jsx
import api from "./axios";

// Get all conversations
export const getConversations = () => {
  return api.get("/messages/conversations");
};

// Get messages in a conversation
export const getMessages = (conversationId) => {
  return api.get(`/messages/${conversationId}`);
};

// Send message to existing conversation
export const sendMessage = (conversationId, content) => {
  return api.post(`/messages/${conversationId}`, { content });
};

// Start new conversation about a listing
export const startConversation = (listingId, initialMessage) => {
  return api.post(`/messages/conversation/${listingId}`, { 
    content: initialMessage 
  });
};