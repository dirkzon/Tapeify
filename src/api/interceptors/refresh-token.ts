import { apiClient } from "../clients";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

apiClient.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!authStore.refreshToken && !authStore.accessToken) {
        router.push({ name: '/' })
        return Promise.reject(error);
      }
      if (authStore.accessTokenExpired && authStore.refreshToken) {
        await authStore.refreshAccessToken();

        error.config.headers.Authorization = `Bearer ${authStore.accessToken}`;

        return apiClient.request(error.config);
      }
      router.push({ name: '/' })
      return Promise.reject(error);
    }
  }
);
