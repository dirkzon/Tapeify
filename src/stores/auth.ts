import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  getters: {
    userAuthorizationUrl: (): URL => {
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
    async requestAccessToken(code: string) {
      const searchParams = new URLSearchParams()
      searchParams.append('grant_type', 'authorization_code')
      searchParams.append('code', code)
      searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)

      const headers = new Headers()
      headers.append('content-type', 'application/x-www-form-urlencoded')
      headers.append(
        'Authorization',
        `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`
      )

      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/api/token')

      return await fetchWrapper.post(url, searchParams, headers)
    },
    async refreshAccessToken(refreshToken: string) {
      const searchParams = new URLSearchParams()
      searchParams.append('grant_type', 'refresh_token')
      searchParams.append('refresh_token', refreshToken)
      searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID)

      const headers = new Headers()
      headers.append('content-type', 'application/x-www-form-urlencoded')

      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/api/token')

      return await fetchWrapper.post(url, searchParams, headers)
    }
  }
})
