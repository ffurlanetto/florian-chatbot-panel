import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
  sender: "user" | "agent";
  text: string;
}

export function useChatWebSocket(url: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [loading, setLoading] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number>(1000); // délai initial = 1s
  const maxRetry = 30000; // max 30s

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const connect = useCallback(() => {
    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      retryRef.current = 1000; // reset retry
    };

    ws.onmessage = (event) => {
      setStatus("connected");
      setLoading(false);
      setMessages((prev) => [...prev, { sender: 'agent', text: event.data }]);
    };

    ws.onclose = () => {
      setStatus("disconnected");
      retryConnection();
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [retryConnection, url]);

  const retryConnection = () => {
    setStatus("disconnected");
    setTimeout(() => {
      retryRef.current = Math.min(retryRef.current * 2, maxRetry); // backoff exponentiel
      connect();
    }, retryRef.current);
  };

  const sendMessage = (text: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send( text );
      setMessages((prev) => [...prev, { sender: "user", text }]);
      setLoading(true);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  },  [url, connect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  },  [messages, loading]);

  return { messages, sendMessage, status, loading, messagesEndRef };
}
