// src/pages/Messages.jsx
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMessages, sendMessage, startConversation } from '../api/messageApi';

const Messages = () => {
  const { user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [listingId, setListingId] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  // Load conversations from localStorage (temp solution until you add backend endpoint)
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations from localStorage (temporary)
  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('conversations');
      if (saved) {
        const convos = JSON.parse(saved);
        setConversations(convos);
        if (convos.length > 0) {
          setSelectedConversation(convos[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save conversation to localStorage
  const saveConversation = (conversation) => {
    const existing = conversations.find(c => c.id === conversation.id);
    let updated;
    if (existing) {
      updated = conversations.map(c => 
        c.id === conversation.id ? conversation : c
      );
    } else {
      updated = [conversation, ...conversations];
    }
    setConversations(updated);
    localStorage.setItem('conversations', JSON.stringify(updated));
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      const response = await sendMessage(selectedConversation.id, newMessage);
      
      // Add new message to list
      const newMsg = response.data;
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Update last message in conversation
      const updatedConvo = {
        ...selectedConversation,
        last_message: newMessage,
        last_message_time: new Date().toISOString()
      };
      saveConversation(updatedConvo);
      setSelectedConversation(updatedConvo);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleStartConversation = async () => {
    if (!listingId.trim() || !initialMessage.trim()) {
      alert('Please enter both listing ID and message');
      return;
    }
    
    setSending(true);
    try {
      const response = await startConversation(listingId, initialMessage);
      const newMessageData = response.data;
      
      // Create new conversation object
      const newConversation = {
        id: newMessageData.conversation_id || Date.now(),
        listing_id: parseInt(listingId),
        listing_title: `Listing #${listingId}`,
        other_party_name: 'Property Owner',
        last_message: initialMessage,
        last_message_time: new Date().toISOString(),
        unread_count: 0
      };
      
      saveConversation(newConversation);
      setSelectedConversation(newConversation);
      setShowNewConversation(false);
      setListingId('');
      setInitialMessage('');
      
      // Fetch messages for the new conversation
      await fetchMessages(newConversation.id);
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please check the listing ID.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedConversation) {
        handleSendMessage();
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading messages...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {/* Start New Conversation Button */}
      {!showNewConversation && (
        <button
          onClick={() => setShowNewConversation(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + New Conversation
        </button>
      )}

      {/* New Conversation Form */}
      {showNewConversation && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold mb-3">Start New Conversation</h3>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Listing ID"
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              placeholder="Your message..."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              rows="3"
              className="w-full p-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={handleStartConversation}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={() => setShowNewConversation(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          
          {/* Conversations List - Left Side */}
          <div className="border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left hover:bg-gray-100 transition border-b ${
                      selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold">
                          {conv.other_party_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Listing: {conv.listing_title || `#${conv.listing_id}`}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {conv.last_message || 'No messages yet'}
                        </div>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area - Right Side */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                  <div className="font-semibold">
                    Conversation #{selectedConversation.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    Listing ID: {selectedConversation.listing_id}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      No messages yet. Send a message to start the conversation.
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`mb-4 flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-800 shadow'
                          }`}
                        >
                          <div className="text-sm break-words">{msg.content}</div>
                          <div className={`text-xs mt-1 ${
                            msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows="2"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation or start a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;