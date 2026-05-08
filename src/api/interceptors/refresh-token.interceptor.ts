import type { AxiosError, AxiosInstance } from "axios";

type AuthStoreLike = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  accessTokenExpired: boolean;
  refreshAccessToken: () => Promise<void>;
};

type RouterLike = {
  push: (...args: any[]) => any;
};

export const createRefreshTokenInterceptor =
  (client: AxiosInstance, authStore: AuthStoreLike, router: RouterLike) =>
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status !== 401 && status !== 403) {
      return Promise.reject(error);
    }

    if (!authStore.refreshToken && !authStore.accessToken) {
      await router.push({ name: "/" });
      return Promise.reject(error);
    }

    if (authStore.accessTokenExpired && authStore.refreshToken) {
      await authStore.refreshAccessToken();

      const config = error.config;

      if (!config) {
        return Promise.reject(error);
      }

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;

      return client.request(config);
    }

    await router.push({ name: "/" });
    return Promise.reject(error);
  };
