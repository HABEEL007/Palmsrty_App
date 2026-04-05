/**
 * @file client.ts
 */

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/user-store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = useUserStore.getState().user;
    // Assuming user object contains accessToken for simplicity
    const token = (user as any)?.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Automatic 401 token refresh (example logic)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const newToken = await refreshAuthToken();
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
};
