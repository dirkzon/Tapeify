import type { InternalAxiosRequestConfig } from "axios";

type AuthStoreLike = {
  accessToken: string | undefined;
};

export const createAuthRequestInterceptor =
  (authStore: AuthStoreLike) =>
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (authStore.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    return config;
  };
