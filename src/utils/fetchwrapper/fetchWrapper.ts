import { useCookies } from 'vue3-cookies';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const { cookies } = useCookies();

export interface FetchOptions extends RequestInit {
  retry?: boolean;
}

export const fetchWrapper = {
  get: <T>(url: URL, options?: FetchOptions) => request<T>('GET', url, options),
  post: <T>(url: URL, options?: FetchOptions) => request<T>('POST', url, options),
  put: <T>(url: URL, options?: FetchOptions) => request<T>('PUT', url, options),
  delete: <T>(url: URL, options?: FetchOptions) => request<T>('DELETE', url, options),
};

async function request<T>(method: string, url: URL, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  const retry = options.retry ?? true
  let body = options.body

  if ((method === 'GET' || method === 'HEAD') && body) {
    console.warn(`Request with ${method} should not include a body. It will be ignored.`);
    body = undefined;
  }

  if (!headers.has('Authorization') && cookies.isKey('access_token')) {
    headers.set('Authorization', `Bearer ${cookies.get('access_token')}`);
  }

  const fetchOptions: FetchOptions = {
    ...options,
    method,
    headers,
    body,
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      return handleError<T>(response, method, url, fetchOptions, retry);
    }
    return await parseResponse<T>(response);
  } catch (err) {
    throw new Error('Network error. Please try again later.');
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as unknown as T;
  }
}

async function handleError<T>(
  response: Response,
  method: string,
  url: URL,
  fetchOptions: FetchOptions,
  retry: boolean
): Promise<T> {
  if (response.status === 401 && cookies.isKey('refresh_token') && retry) {
    try {
      const authStore = useAuthStore();
      const { access_token, refresh_token } = await authStore.refreshAccessToken(
        cookies.get('refresh_token')
      );

      cookies.set('access_token', access_token, 3600);
      cookies.set('refresh_token', refresh_token);

      const headers = new Headers(fetchOptions.headers || {});
      headers.set('Authorization', `Bearer ${access_token}`);

      const newOptions: FetchOptions = {
        ...fetchOptions,
        headers,
        retry: false
      };

      return await request<T>(method, url, newOptions);
    } catch (refreshError) {
      console.warn('Token refresh failed', refreshError);
      router.push({ name: '/LoginView' });
      throw new Error('Session expired. Please login again.');
    }
  }

  const errorBody = await response.json()
  throw new Error(response.statusText);
}

