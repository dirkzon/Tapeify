import { useAuthStore } from "@/stores/auth";
import { apiClient } from "./clients/api.client";
import { createAuthRequestInterceptor, createRateLimitInterceptor, createRefreshTokenInterceptor,  } from "./interceptors";
import router from "@/router";

export function setupInterceptors(): void {
  const authStore = useAuthStore();

  apiClient.interceptors.request.use(createAuthRequestInterceptor(authStore));
  apiClient.interceptors.response.use((res) => res, createRefreshTokenInterceptor(apiClient, authStore, router))
  apiClient.interceptors.response.use((res) => res, createRateLimitInterceptor(apiClient));
}
