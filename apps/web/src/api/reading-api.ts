/**
 * @file reading.api.ts
 */

import { apiClient } from './client';
import type { ApiResponse } from './client';
import type { PalmReading } from '@palmistry/types';

export const readingApi = {
  analyze: async (userId: string, leftImage: File | null, rightImage: File | null): Promise<ApiResponse<PalmReading>> => {
    let leftImageUrl = '';
    let rightImageUrl = '';

    const uploadImage = async (file: File) => {
      // Helper to convert File to base64 for image-service
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          try {
            const resp = await apiClient.post('/image/upload', { image: reader.result });
            resolve(resp.data.data.imageUrl);
          } catch (e) { reject(e); }
        };
        reader.onerror = reject;
      });
    };

    if (leftImage) leftImageUrl = await uploadImage(leftImage);
    if (rightImage) rightImageUrl = await uploadImage(rightImage);

    const response = await apiClient.post<ApiResponse<PalmReading>>('/ai/analyze', {
      userId,
      leftHandImage: leftImageUrl,
      rightHandImage: rightImageUrl,
    });

    return response.data;
  },

  getReading: async (id: string): Promise<ApiResponse<PalmReading>> => {
    const response = await apiClient.get<ApiResponse<PalmReading>>(`/user/readings/${id}`);
    return response.data;
  },

  getHistory: async (): Promise<ApiResponse<PalmReading[]>> => {
    const response = await apiClient.get<ApiResponse<PalmReading[]>>('/user/readings');
    return response.data;
  },
};
