import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper';
import { useAuthStore } from '@/stores/auth';
import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';
import { useCookies } from 'vue3-cookies';
import router from '../../router';

const { cookies } = useCookies();

describe('FetchWrapper Tests', () => {
  const mockUrl = new URL('https://test.com/');
  const mockAccessToken = '0123456789';
  const mockRefreshToken = '9876543210';

  const successfulFetchResponse = {
    status: 200,
    ok: true,
    json: async () => ({ message: 'hello world!' }),
  } as Response;

  const unauthorizedFetchResponse = {
    status: 401,
    ok: false,
    json: async () => ({ message: 'unauthorized' }),
  } as Response;

  beforeEach(() => {
    setActivePinia(createPinia());
    cookies.get = vi.fn().mockImplementation((keyName: string) => {
      switch (keyName) {
        case 'access_token':
          return mockAccessToken;
        case 'refresh_token':
          return mockRefreshToken;
        default:
          return null;
      }
    });
    cookies.set = vi.fn().mockReturnThis();
    cookies.isKey = vi.fn().mockImplementation((keyName: string) => {
      return keyName === 'access_token' || keyName === 'refresh_token';
    });

    vi.mock('../../router', () => ({
      default: {
        push: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set access token cookie and make GET request', async () => {
    const expectedHeaders = new Headers();
    expectedHeaders.append('Authorization', `Bearer ${mockAccessToken}`);

    global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
    const fetchSpy = vi.spyOn(global, 'fetch');

    await fetchWrapper.get(mockUrl);

    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
      method: 'GET',
      headers: expectedHeaders,
      body: undefined,
    });
  });

  describe('API calls', () => {
    const expectedHeaders = new Headers();
    expectedHeaders.append('test', 'header');

    const body = JSON.stringify({ test: 'body' });

    it('should make POST request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.post(mockUrl, body, expectedHeaders);

      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
        method: 'POST',
        headers: expectedHeaders,
        body: body,
      });
    });

    it('should make PUT request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.put(mockUrl, body, expectedHeaders);

      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
        method: 'PUT',
        headers: expectedHeaders,
        body: body,
      });
    });

    it('should make DELETE request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.delete(mockUrl, body, expectedHeaders);

      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
        method: 'DELETE',
        headers: expectedHeaders,
        body: body,
      });
    });
  });

  describe('Handle response', () => {
    it('should return JSON on successful response', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);

      const result = await fetchWrapper.get(mockUrl);
      expect(result).toStrictEqual({ message: 'hello world!' });
    });

    describe('Unsuccessful responses', () => {
      // it('should handle 401 with refresh token', async () => {
      //   global.fetch = vi.fn().mockResolvedValueOnce(unauthorizedFetchResponse);
      //   const authStore = useAuthStore();
      //   authStore.refreshAccessToken = vi.fn().mockResolvedValue({
      //     access_token: 'new_access',
      //     refresh_token: 'new_refresh',
      //   });

      //   await fetchWrapper.get(mockUrl);

      //   expect(cookies.set).toHaveBeenCalled
      //   expect(cookies.set).toHaveBeenCalledWith('access_token', 'new_access', 3600);
      //   expect(cookies.set).toHaveBeenCalledWith('refresh_token', 'new_refresh');
      //   expect(global.fetch).toHaveBeenCalledTimes(2)
      // });

      it('should handle 401 without refresh token', async () => {
        cookies.isKey = vi.fn().mockReturnValue(false)
        global.fetch = vi.fn().mockResolvedValueOnce(unauthorizedFetchResponse);

        await fetchWrapper.get(mockUrl);

        const navigateSpy = vi.spyOn(router, 'push');
        expect(navigateSpy).toHaveBeenCalledWith({ name: '/LoginView' });
      });

      it('should throw an error for other unsuccessful responses', async () => {
        const errorResponse = {
          status: 500,
          ok: false,
          json: async () => ({ message: 'server error' }),
        } as Response;

        global.fetch = vi.fn().mockResolvedValueOnce(errorResponse);

        await expect(fetchWrapper.get(mockUrl)).rejects.toThrow();
      });
    });
  });
});
