import { useEffect, useRef, useState } from "react";

export const useSocket = (chatId: number | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);

    ws.onopen = () => {
      console.log("WebSocket соединение открыто");
    };

    ws.onclose = () => {
      console.log("WebSocket соединение закрыто");
    };

    ws.onerror = (e) => {
      console.error("Ошибка WebSocket:", e);
    };

    socketRef.current = ws;
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [chatId]);

  return socket;
};
