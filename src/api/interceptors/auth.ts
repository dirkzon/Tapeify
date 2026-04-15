import { apiClient } from "../clients";
import { useAuthStore } from "@/stores/auth";

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
