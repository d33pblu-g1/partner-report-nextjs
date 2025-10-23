/**
 * Global State Store
 * Using Zustand for simple state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Selected partner
  selectedPartnerId: string | null;
  setSelectedPartnerId: (partnerId: string | null) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  
  // Right Menu
  isRightMenuOpen: boolean;
  setRightMenuOpen: (isOpen: boolean) => void;
  toggleRightMenu: () => void;
  
  // Language
  language: string;
  setLanguage: (language: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Partner selection
      selectedPartnerId: null,
      setSelectedPartnerId: (partnerId) => set({ selectedPartnerId: partnerId }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Sidebar
      isSidebarOpen: true,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Right Menu
      isRightMenuOpen: false,
      setRightMenuOpen: (isOpen) => set({ isRightMenuOpen: isOpen }),
      toggleRightMenu: () => set((state) => ({ isRightMenuOpen: !state.isRightMenuOpen })),
      
      // Language
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'partner-report-storage', // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        selectedPartnerId: state.selectedPartnerId,
      }),
    }
  )
);

