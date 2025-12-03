import type { TokenResponse } from '@/types/spotify/responses'
import { authApiClient } from '@/utils/api/clients';
import { defineStore } from 'pinia'
import qs from "qs";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
  }),
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
    async requestAccessToken(code: string): Promise<void> {
      const body = qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      });

      const response = await authApiClient.post<TokenResponse>(
        "/api/token",
        body,
        {
          headers: {
            "Authorization": `Basic ${btoa(
              `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresIn = response.data.expires_in;
    },

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
      const body = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: import.meta.env.VITE_CLIENT_ID,
      });

      const response = await authApiClient.post<TokenResponse>(
        "/api/token",
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
