/**
 * @file readingStore.ts
 */

import { create } from 'zustand';
import { PalmReading } from '@palmistry/types';

interface ReadingState {
  currentReading: PalmReading | null;
  history: PalmReading[];
  setReading: (reading: PalmReading | null) => void;
  setHistory: (history: PalmReading[]) => void;
  clearReading: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentReading: null,
  history: [],
  setReading: (currentReading) => set({ currentReading }),
  setHistory: (history) => set({ history }),
  clearReading: () => set({ currentReading: null }),
}));
