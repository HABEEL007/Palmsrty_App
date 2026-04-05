/**
 * @file reading-store.ts
 * @description Zustand store for reading state management
 */

import { create } from 'zustand';

interface ReadingResult {
  handShape: string;
  sections: Array<{
    id: string;
    label: string;
    color: string;
    fillColor: string;
    score: number;
    text: string;
  }>;
}

interface ReadingStore {
  imageData: string | null;
  readingResult: ReadingResult | null;
  setImageData: (data: string) => void;
  setReadingResult: (result: ReadingResult) => void;
  clearReading: () => void;
}

export const useReadingStore = create<ReadingStore>((set) => ({
  imageData: null,
  readingResult: null,
  setImageData: (imageData) => set({ imageData }),
  setReadingResult: (readingResult) => set({ readingResult }),
  clearReading: () => set({ imageData: null, readingResult: null }),
}));
