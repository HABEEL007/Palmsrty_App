/**
 * @file uiStore.ts
 */

import { create } from 'zustand';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UIState {
  theme: 'dark' | 'light';
  isLoading: boolean;
  activeModal: string | null;
  toast: Toast | null;
  setIsLoading: (isLoading: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setToast: (toast: Toast | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  isLoading: false,
  activeModal: null,
  toast: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => set({ toast: null }), 3000);
    }
  },
}));
