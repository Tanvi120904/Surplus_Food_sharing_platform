import { useState } from 'react';
import axios from 'axios';

const NotificationCard = ({ notification }) => {
  const [status, setStatus] = useState(notification.status || "Sent"); // Default to "Sent"

  const handleAcknowledge = async () => {
    try {
      // Send acknowledgment to the backend
      await axios.post(`/api/acknowledge-notification/${notification.id}/`);
      setStatus("Acknowledged");  // Update status after successful acknowledgment
    } catch (error) {
      console.error("Error acknowledging notification:", error);
    }
  };

  return (
    <div className="notification-card">
      <p><strong>Notification:</strong> {notification.message}</p>
      <p><strong>Status:</strong> {status}</p>
      <button onClick={handleAcknowledge}>Acknowledge</button>
    </div>
  );
};

export default NotificationCard;
