import { create } from 'zustand';
import { Notification } from '../types';
import { mockNotifications } from '../lib/mock-data';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  addNotification: (n) => set((state) => {
    const newN: Notification = {
      ...n,
      id: String(Math.floor(Math.random() * 1000000)),
      timestamp: new Date().toISOString(),
      read: false
    };
    const notifications = [newN, ...state.notifications];
    return {
      notifications,
      unreadCount: notifications.filter(item => !item.read).length
    };
  }),
  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    };
  }),
  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, read: true }));
    return {
      notifications,
      unreadCount: 0
    };
  }),
  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));
