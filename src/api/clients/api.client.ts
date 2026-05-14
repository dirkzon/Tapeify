import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SPOTIFY_ENDPOINT,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
