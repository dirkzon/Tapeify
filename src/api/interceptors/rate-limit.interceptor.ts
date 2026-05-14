import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const createRateLimitInterceptor =
  (client: AxiosInstance) =>
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig | undefined;

      if (!config || !error.response) {
        return Promise.reject(error);
      }

      if (error.response.status !== 429) {
        return Promise.reject(error);
      }

      const method = config.method?.toLowerCase();

      const safeMethods = ["get", "head", "put", "delete"];

      if (!method || !safeMethods.includes(method)) {
        return Promise.reject(error);
      }

      const retryAfterSecs = parseInt(
        error.response.headers["retry-after"],
        10
      );

      const delayMs =
        (Number.isFinite(retryAfterSecs) ? retryAfterSecs : 1) * 1000;

      const wait = (ms: number) =>
        new Promise((res) => setTimeout(res, ms));

      await wait(Math.min(delayMs, 120_000));

      return client.request(config);
    };
