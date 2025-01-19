import { useCookies } from "vue3-cookies";
import Router from '../router'; 
import { useAuthStore } from '@/stores/auth'

const { cookies } = useCookies()

export const fetchWrapper = {
    get: (url: URL, headers?: Headers) => request('GET')(url, undefined, headers),
    post: (url: URL, body?: URLSearchParams, headers?: Headers) => request('POST')(url, body, headers),
    put: (url: URL, body?: URLSearchParams, headers?: Headers) => request('PUT')(url, body, headers),
    delete: (url: URL, body?: URLSearchParams, headers?: Headers) => request('DELETE')(url, body, headers),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const request = (method: string) => async (url: URL, body?: URLSearchParams, headers: Headers = new Headers()): Promise<any> => {
    if (cookies.isKey('access_token')){
        const accessToken = cookies.get('access_token')
        headers.delete("Authorization")
        headers.append('Authorization', `Bearer ${accessToken}`)
    }

    return fetch(url, {
        method: method,
        headers: headers,
        body: body
    }).then((response) => handleResponse(response, url, method, headers))
}

const handleResponse = async (response: Response, url: URL, method: string, headers: Headers, body?: URLSearchParams) => {
    const authStore = useAuthStore()

    if (!response.ok) {
        if (response.status === 401) {
            if (cookies.isKey('refresh_token')) {
                console.info("Refreshing token.")
                
                const refreshToken = cookies.get('refresh_token')

                const { access_token, refresh_token } = await authStore.refreshAccessToken(refreshToken)
                cookies.remove('access_token')
                cookies.set('access_token', access_token)
                cookies.remove('refresh_token')
                cookies.set("refresh_token", refresh_token)

                return request(method)(url, body, headers)
            } else {
                Router.push('/login')
            }
        }
    }

    return response.json()
}
