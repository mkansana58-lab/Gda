export type NotificationIcon = 'Bell' | 'FilePen' | 'Sparkles' | 'CheckCircle' | 'Newspaper';

export interface Notification {
  id: string;
  icon: NotificationIcon;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
}

const MAX_NOTIFICATIONS = 20;

export const getNotifications = (userEmail: string | undefined): Notification[] => {
  if (!userEmail) return [];
  const key = `user-notifications-${userEmail}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const addNotification = (userEmail: string | undefined, notification: Omit<Notification, 'read' | 'timestamp'>) => {
  if (!userEmail) return;
  
  const fullNotification: Notification = {
    ...notification,
    read: false,
    timestamp: new Date().toISOString(),
  };

  const notifications = getNotifications(userEmail);
  const newNotifications = [fullNotification, ...notifications].slice(0, MAX_NOTIFICATIONS);
  
  const key = `user-notifications-${userEmail}`;
  localStorage.setItem(key, JSON.stringify(newNotifications));
};

export const markAllAsRead = (userEmail: string | undefined) => {
    if (!userEmail) return;
    const notifications = getNotifications(userEmail);
    const readNotifications = notifications.map(n => ({...n, read: true}));
    const key = `user-notifications-${userEmail}`;
    localStorage.setItem(key, JSON.stringify(readNotifications));
}
