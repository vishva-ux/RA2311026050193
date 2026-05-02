import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import logger from 'logging_middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      readIds: [], // Store IDs of viewed notifications
      isAuthenticated: false,
      
      setAuth: (status) => {
        logger.Log('frontend', 'info', 'state', `Setting auth status to ${status}`);
        set({ isAuthenticated: status });
      },

      setNotifications: (newNotifications) => {
        logger.Log('frontend', 'info', 'state', `Updating notifications store with ${newNotifications.length} items`);
        
        // Merge with existing to keep read status
        const merged = newNotifications.map(n => ({
          ...n,
          isRead: get().readIds.includes(n.ID)
        }));
        
        set({ notifications: merged });
      },

      markAsRead: (id) => {
        logger.Log('frontend', 'info', 'state', `Marking notification ${id} as read`);
        set((state) => ({
          readIds: [...new Set([...state.readIds, id])],
          notifications: state.notifications.map(n => 
            n.ID === id ? { ...n, isRead: true } : n
          )
        }));
      },
      
      clearStore: () => {
        logger.Log('frontend', 'info', 'state', 'Clearing store');
        set({ notifications: [], readIds: [], isAuthenticated: false });
      }
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({ readIds: state.readIds }), // Only persist read IDs
    }
  )
);
