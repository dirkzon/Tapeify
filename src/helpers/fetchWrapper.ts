import { useCookies } from 'vue3-cookies'
import { useAuthStore } from '@/stores/auth'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (url: URL, body?: URLSearchParams, headers: Headers = new Headers()): Promise<any> => {
    if (!headers.has('Authorization') && cookies.isKey('access_token')) {
      const accessToken = cookies.get('access_token')
      headers.append('Authorization', `Bearer ${accessToken}`)
    }

    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then((response) => handleResponse(response))
  }

const handleResponse = async (
  response: Response,
  // url: URL,
  // method: string,
  // headers: Headers,
  // body?: URLSearchParams
) => {
  const authStore = useAuthStore()

  if (!response.ok) {
    if (response.status === 401) {
      console.log(response)
      if (cookies.isKey('refresh_token')) {
        console.info('Refreshing token.')

        const { access_token, refresh_token } = await authStore.refreshAccessToken(
          cookies.get('refresh_token')
        )
        cookies.set('access_token', access_token, 3600)
        cookies.set('refresh_token', refresh_token, '1d')

        // return request(method)(url, body, headers)
      } else {
      }
    }
  }
  
  return response.json()
}
