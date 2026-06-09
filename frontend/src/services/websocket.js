
class WebSocketService {
  constructor() {
    this.socket = null;
    this.conversationId = null;
    this.messageHandlers = [];
  }

  connect(conversationId) {
    // Use wss:// for production (HTTPS) or ws:// for local development
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const backendUrl = import.meta.env.VITE_API_URL || "localhost:8000";
    const host = backendUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/ws/chat/${conversationId}`;
    
    this.socket = new WebSocket(wsUrl);
    this.conversationId = conversationId;

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    console.warn("WebSocket is not connected.");
    return false;
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new WebSocketService();