// src/pages/Chat.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../api/messageApi';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(conversationId, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/messages')} className="mb-4 text-blue-600">
        ← Back to Messages
      </button>
      <div className="bg-white rounded-lg shadow h-96 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender_id === user?.id ? 'text-right' : ''}`}>
            <span className={`inline-block p-2 rounded ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-2 border rounded-lg"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;