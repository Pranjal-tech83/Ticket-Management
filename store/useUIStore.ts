import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newTicketModalOpen: boolean;
  setNewTicketModalOpen: (open: boolean) => void;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  newTicketModalOpen: false,
  setNewTicketModalOpen: (open) => set({ newTicketModalOpen: open }),
  currentTheme: 'dark',
  setTheme: (theme) => set({ currentTheme: theme }),
}));
