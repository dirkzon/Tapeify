import { apiClient } from "../clients";

apiClient.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const config = error.config || {};

    if (error.response?.status === 429) {
      const safeMethods = ['get', 'head', 'put', 'delete'];
      if (!config.method || !safeMethods.includes(config.method.toLowerCase())) {
        return Promise.reject(error);
      }

      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

      const retryAfterSecs = parseInt(error.response.headers['retry-after'], 10) || 1;
      const delayMs = Math.min(retryAfterSecs, 120) * 1000;

      await wait(delayMs);

      return apiClient.request(config);
    }
  }
);
