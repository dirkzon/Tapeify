import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  getters: {
    userAuthorizationUrl: () => {
      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/authorize')
      const searchParams = new URLSearchParams()
      searchParams.append('response_type', 'code')
      searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID)
      searchParams.append('scope', 'user-read-private user-read-email playlist-read-private')
      searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)
      url.search = searchParams.toString()
      return url.toString()
    }
  },
  actions: {
    async requestAccessToken(code: string) {
      const params = new URLSearchParams()
      params.append('grant_type', 'authorization_code')
      params.append('code', code)
      params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)

      const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI + '/api/token')
      await fetch(url, {
        method: 'Post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }).then(async (response: Response) => {
        if (response.ok) {
          const body = await response.json()
          console.log(body)
          console.log(body['access_token'])
        }
      })
    }
  }
})
