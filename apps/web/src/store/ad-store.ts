/**
 * @file adStore.ts
 */

import { create } from 'zustand';

interface AdState {
  readingCount: number;
  lastInterstitialTime: number;
  shouldShowAd: () => boolean;
  incrementReadingCount: () => void;
}

export const useAdStore = create<AdState>((set, get) => ({
  readingCount: 0,
  lastInterstitialTime: 0,
  shouldShowAd: () => {
    const { readingCount, lastInterstitialTime } = get();
    const timeSinceLastAd = Date.now() - lastInterstitialTime;
    // Show ad every 3 readings or every 5 minutes
    return readingCount > 0 && (readingCount % 3 === 0 || timeSinceLastAd > 300000);
  },
  incrementReadingCount: () => set((state) => ({ readingCount: state.readingCount + 1 })),
}));
