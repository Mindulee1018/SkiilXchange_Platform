import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

export function useWebSocket(topic = '/topic/learning-plan-updates') {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(WEBSOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(topic, (message) => {
          if (!message.body) return;

          try {
            const body = JSON.parse(message.body);
            setMessages((prev) => [body, ...prev]);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [topic]);

  return messages;
}
