import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: 'u1',
    name: 'Pranjal Kumar',
    email: 'roman838303@gmail.com',
    avatar: '/profile.png',
    role: 'admin',
    department: 'Operations',
    createdAt: '2026-01-10T12:00:00Z',
  },
  isAuthenticated: true, // Default authenticated for demo
  login: (email, name) => set({
    user: {
      id: 'u_user',
      name,
      email,
      avatar: '/profile.png',
      role: 'admin',
      department: 'Operations',
      createdAt: new Date().toISOString(),
    },
    isAuthenticated: true,
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (fields) => set((state) => ({
    user: state.user ? { ...state.user, ...fields } : null
  })),
}));
