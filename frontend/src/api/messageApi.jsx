// src/api/messageApi.jsx
import api from "./axios";

// Start a new conversation about a listing and send first message
// POST /messages/conversation/{listing_id}
export const startConversation = (listingId, content) => {
  return api.post(`/messages/conversation/${listingId}`, {
    content: content,
    sender_id: null  // Backend will get from token
  });
};

// Send message to existing conversation
// POST /messages/{conversation_id}
export const sendMessage = (conversationId, content) => {
  return api.post(`/messages/${conversationId}`, {
    content: content,
    sender_id: null  // Backend will get from token
  });
};

// Get all messages in a conversation
// GET /messages/{conversation_id}
export const getMessages = (conversationId) => {
  return api.get(`/messages/${conversationId}`);
};

// NOTE: You need to create a GET /conversations endpoint in your backend
// For now, we'll store conversations locally or fetch from a separate endpoint
// If you don't have a conversations list endpoint, we'll track them manually