import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chat-store";
import { useSocket } from "../../hooks/useSocket";

export const ChatRoom = () => {
  const chatId = useChatStore((s) => s.currentChatId);
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const [newMessage, setNewMessage] = useState("");
  const socket = useSocket(chatId);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
        addMessage(data);
      }
    };
  }, [socket]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (socket && socket.readyState === WebSocket.OPEN && newMessage.trim()) {
      const payload = JSON.stringify({ message: newMessage });
      socket.send(payload);
      setNewMessage("");
    } else {
      alert("Соединение не установлено или сообщение пустое");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages?.map((msg, index) => (
          <div
            key={msg.id}
            className={`message ${
              index === messages.length - 1 ? "new-message" : ""
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="input-row">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Напишите сообщение..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Отправка..." : "Отправить"}
        </button>
      </div>
    </div>
  );
};
