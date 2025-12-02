import type { TokenResponse } from '@/types/spotify/responses'
import { defineStore } from 'pinia'
import axios from "axios";
import qs from "qs";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SPOTIFY_AUTH_URI,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

export const useAuthStore = defineStore('auth', {
  getters: {
    userAuthorizationUrl(): URL {
      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/authorize')
      const searchParams = new URLSearchParams()
      searchParams.append('response_type', 'code')
      searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID)
      searchParams.append('scope', 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private')
      searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)
      url.search = searchParams.toString()
      return url
    }
  },
  actions: {
    async requestAccessToken(code: string): Promise<TokenResponse> {
      const url = `${import.meta.env.VITE_SPOTIFY_AUTH_URI}/api/token`;

      const body = qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      });

      const response = await apiClient.post<TokenResponse>(
        url,
        body,
        {
          headers: {
            "Authorization": `Basic ${btoa(
              `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`
          }
        }
      );

      return response.data;
    },

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
      const url = `${import.meta.env.VITE_SPOTIFY_AUTH_URI}/api/token`;

      const body = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: import.meta.env.VITE_CLIENT_ID,
      });

      const response = await apiClient.post<TokenResponse>(
        url,
        body,
        {
          headers: {
            "Authorization": `Basic ${btoa(
              `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`
          }
        }
      );

      return response.data;
    }
  }
})
