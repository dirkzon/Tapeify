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
