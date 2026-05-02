import { authApiClient } from '@/api/clients';
import type { TokenResponse } from '@/types/spotify/responses'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import qs from "qs";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useStorage<string | undefined>('access_token', undefined),
    refreshToken: useStorage<string | undefined>('refresh_token', undefined),
    expiresAt: useStorage<number | undefined>('expires_in', undefined),
    codeVerifier: useStorage<string | undefined>('code_verifier', undefined),
  }),
  getters: {
    accessTokenExpired(): boolean {
      if (!this.expiresAt) return true
      return Date.now() >= this.expiresAt
    }
  },
  actions: {
    async generateUserAuthorizationUrl(): Promise<URL> {
      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/authorize')
      const searchParams = new URLSearchParams()
      searchParams.append('response_type', 'code')
      searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID)
      searchParams.append('scope', 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private')
      searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)
      searchParams.append('code_challenge_method', 'S256')
      const codeVerifier = this._generateCodeVerifier()
      this.codeVerifier = codeVerifier
      const hashedVerifier = await this._hashCodeVerifier(this.codeVerifier)
      const codeChallenge = this._generateCodeChallenge(hashedVerifier)
      searchParams.append('code_challenge', codeChallenge)
      url.search = searchParams.toString()
      return url
    },
    async requestAccessToken(code: string): Promise<void> {
      const client_id = import.meta.env.VITE_CLIENT_ID

      const body = qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        code_verifier: this.codeVerifier,
        client_id: client_id
      });

      const response = await authApiClient.post<TokenResponse>(
        "/api/token",
        body,
        {
          headers: {
            "Authorization": `Basic ${btoa(
              `${client_id}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = Date.now() + response.data.expires_in * 1000
    },
    async refreshAccessToken(): Promise<void> {
      const client_id = import.meta.env.VITE_CLIENT_ID
      const body = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
        client_id: client_id,
      });

      const response = await authApiClient.post<TokenResponse>(
        "/api/token",
        body,
        {
          headers: {
            "Authorization": `Basic ${btoa(
              `${client_id}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = Date.now() + response.data.expires_in * 1000
    },
    _generateCodeVerifier(length: number = 128): string {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    },
    _hashCodeVerifier(codeVerifier: string): Promise<ArrayBuffer> {
      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      return window.crypto.subtle.digest('SHA-256', data)
    },
    _generateCodeChallenge(input: ArrayBuffer): string {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    },
  }
})
