import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

const NotificationPanel = () => {
  const messages = useWebSocket('/topic/learning-plan-updates'); // your topic here
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log('Received WebSocket messages:', messages);
    // Add new messages to the notification state
    const newNotifications = messages.map((msg) => ({
      id: Date.now() + Math.random(), // unique ID
      type: msg.type,
      message: `Plan ${msg.type}: ${msg.payload?.title || 'Untitled'}`,
    }));

    setNotifications(newNotifications);
  }, [messages]);

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.map((note) => (
          <li key={note.id} className="border-b pb-1">
            <span className="font-semibold">{note.type}</span>: {note.message}
          </li>
        ))}
        {notifications.length === 0 && <li>No notifications yet.</li>}
      </ul>
    </div>
  );
};

export default NotificationPanel;
