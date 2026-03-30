/**
 * @file reading.api.ts
 */

import { apiClient, ApiResponse } from './client';
import { PalmReading } from '@palmistry/types';

export const readingApi = {
  analyze: async (leftImage: File | null, rightImage: File | null): Promise<ApiResponse<PalmReading>> => {
    const formData = new FormData();
    if (leftImage) formData.append('leftHand', leftImage);
    if (rightImage) formData.append('rightHand', rightImage);
    
    const response = await apiClient.post<ApiResponse<PalmReading>>('/reading/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getReading: async (id: string): Promise<ApiResponse<PalmReading>> => {
    const response = await apiClient.get<ApiResponse<PalmReading>>(`/reading/${id}`);
    return response.data;
  },

  getHistory: async (): Promise<ApiResponse<PalmReading[]>> => {
    const response = await apiClient.get<ApiResponse<PalmReading[]>>('/reading/history');
    return response.data;
  },
};
