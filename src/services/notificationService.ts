import {SportEvent} from '../types/event';

const NOTIFICATIONS_KEY = 'sportify_notifications';

interface NotificationData {
  id: string;
  eventId: string;
  title: string;
  message: string;
  scheduledFor: string;
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Ce navigateur ne prend pas en charge les notifications');
    return 'denied';
  }

  return await Notification.requestPermission();
};

export const scheduleNotification = (event: SportEvent, notificationDate: Date) => {
  const notifications = getScheduledNotifications();
  const notificationId = `notification-${Date.now()}`;

  const newNotification: NotificationData = {
    id: notificationId,
    eventId: event.id,
    title: 'Rappel Événement',
    message: `${event.title} commence ${getTimeMessage(notificationDate)}`,
    scheduledFor: notificationDate.toISOString()
  };

  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

  const timeUntilNotification = notificationDate.getTime() - Date.now();
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      showNotification(newNotification);
      removeScheduledNotification(notificationId);
    }, timeUntilNotification);
  }
};

const showNotification = (notification: NotificationData) => {
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/pwa-192x192.png'
    });
  }
};

export const getScheduledNotifications = (): NotificationData[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des notifications:', error);
    return [];
  }
};

const removeScheduledNotification = (notificationId: string) => {
  const notifications = getScheduledNotifications();
  const updatedNotifications = notifications.filter(n => n.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

const getTimeMessage = (notificationDate: Date): string => {
  const now = new Date();
  const diffMinutes = Math.round((notificationDate.getTime() - now.getTime()) / (1000 * 60));

  if (diffMinutes >= 24 * 60) {
    return 'demain';
  } else if (diffMinutes >= 60) {
    return `dans ${Math.round(diffMinutes / 60)} heures`;
  } else {
    return `dans ${diffMinutes} minutes`;
  }
};
