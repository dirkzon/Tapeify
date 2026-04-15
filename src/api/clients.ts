import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_SPOTIFY_AUTH_URI,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SPOTIFY_ENDPOINT,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore();
    const config = error.config || {};

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!authStore.refreshToken && !authStore.accessToken) {
        router.push({ name: '/login' })
        return Promise.reject(error);
      }
      if (authStore.accessTokenExpired && authStore.refreshToken) {
        await authStore.refreshAccessToken();

        error.config.headers.Authorization = `Bearer ${authStore.accessToken}`;

        return apiClient.request(error.config);
      }
      router.push({ name: '/login' })
      return Promise.reject(error);
    }
    if (error.response?.status === 429) {
      const safeMethods = ['get', 'head', 'put', 'delete'];
      if (!config.method || !safeMethods.includes(config.method.toLowerCase())) {
        return Promise.reject(error);
      }

      config.__retryCount = config.__retryCount || 0;
      const MAX_RETRIES = 5;
      if (config.__retryCount >= MAX_RETRIES) return Promise.reject(error);

      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

      const retryAfterSecs = parseInt(error.response.headers['retry-after'], 10) || 1;
      const delayMs = Math.min(retryAfterSecs, 120) * 1000;

      config.__retryCount += 1;
      await wait(delayMs);

      return apiClient.request(config);
    }

    return Promise.reject(error);
  }
);
