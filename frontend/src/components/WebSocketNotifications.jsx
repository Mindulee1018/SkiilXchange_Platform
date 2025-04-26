import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // Make sure to install: npm install @stomp/stompjs

const WebSocketNotifications = () => {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        client.subscribe('/topic/plans', (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body.message]);
        });
      },
      onDisconnect: () => {
        console.log('❌ Disconnected from WebSocket');
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            marginBottom: '10px',
            backgroundColor: '#1e90ff',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.5s',
          }}
        >
          🔔 {msg}
        </div>
      ))}
    </div>
  );
};

export default WebSocketNotifications;
