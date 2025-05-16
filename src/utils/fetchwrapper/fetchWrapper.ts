import { useCookies } from 'vue3-cookies'
import { useAuthStore } from '@/stores/auth'
import router from '../../router'

const { cookies } = useCookies()

export const fetchWrapper = {
  get: (url: URL, headers?: Headers) => request('GET')(url, undefined, headers),
  post: (url: URL, body?: URLSearchParams, headers?: Headers) =>
    request('POST')(url, body, headers),
  put: (url: URL, body?: URLSearchParams, headers?: Headers) => request('PUT')(url, body, headers),
  delete: (url: URL, body?: URLSearchParams, headers?: Headers) =>
    request('DELETE')(url, body, headers)
}

const request =
  (method: string) =>
  async (url: URL, body?: URLSearchParams, headers: Headers = new Headers()) => {
    if (!headers.has('Authorization') && cookies.isKey('access_token')) {
      const accessToken = cookies.get('access_token')
      headers.append('Authorization', `Bearer ${accessToken}`)
    }

    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then((response) => handleResponse(response, url, method, headers, body))
  }

const handleResponse = async (
  response: Response,
  url: URL,
  method: string,
  headers: Headers,
  body?: URLSearchParams
) => {
  if (!response.ok) {
    if (response.status === 401) {
      if (cookies.isKey('refresh_token')) {
        const authStore = useAuthStore()
        const { access_token, refresh_token } = await authStore.refreshAccessToken(
          cookies.get('refresh_token')
        )
        cookies.set('access_token', access_token, 3600)
        cookies.set('refresh_token', refresh_token)
        fetch(url, {
          method: method,
          headers: headers,
          body: body
        }).then(() => response.json())
      } else {
        router.push({ name: '/LoginView' })
      }
    }
  }
  return response.json()
}
