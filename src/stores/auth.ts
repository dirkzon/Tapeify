import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { defineStore } from 'pinia'

interface TokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: string
  refresh_token: string
}

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
    async requestAccessToken(code: string): Promise<TokenResponse>  {
      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/api/token')

      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('code', code);
      body.set('redirect_uri', import.meta.env.VITE_REDIRECT_URI);

      return await fetchWrapper.post<TokenResponse>(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':`Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`
        },
        body: body
      })
    },
    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/api/token')

      const body = new URLSearchParams();
      body.set('grant_type', 'refresh_token');
      body.set('refresh_token', refreshToken);
      body.set('client_id', import.meta.env.VITE_CLIENT_ID);

      return await fetchWrapper.post<TokenResponse>(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      })
    }
  }
})
