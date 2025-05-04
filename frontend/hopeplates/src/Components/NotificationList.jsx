import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationCard from './NotificationCard';  // Import the NotificationCard component

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the backend when the component mounts
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications/');
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-list">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}  // Pass the notification data to the NotificationCard
        />
      ))}
    </div>
  );
};

export default NotificationsList;
