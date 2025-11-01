import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper';
import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';
import { useCookies } from 'vue3-cookies';
import router from '../../router';
import { useAuthStore } from '@/stores/auth';

const { cookies } = useCookies();

describe('FetchWrapper Tests', () => {
  const mockUrl = new URL('https://test.com/');
  const mockAccessToken = '0123456789';
  const mockRefreshToken = '9876543210';

  const successfulFetchResponse = {
    ok: true,
    status: 200,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => ({ message: 'hello world!' }),
  } as Response;

  const unauthorizedFetchResponse = {
    ok: false,
    status: 401,
    headers: new Headers({ 'Content-Type': 'application/json' }),
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
    expectedHeaders.append('Authorization', `Bearer ${mockAccessToken}`);

    const body = JSON.stringify({ test: 'body' });

    it('should make POST request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.post(mockUrl, {
        headers: expectedHeaders,
        body: body
      });

      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
        method: 'POST',
        headers: expectedHeaders,
        body: body,
      });
    });

    it('should make PUT request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.put(mockUrl, {
        headers: expectedHeaders,
        body: body
      })
      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(mockUrl, {
        method: 'PUT',
        headers: expectedHeaders,
        body: body,
      });
    });

    it('should make DELETE request with correct headers and body', async () => {
      global.fetch = vi.fn().mockResolvedValue(successfulFetchResponse);
      const fetchSpy = vi.spyOn(global, 'fetch');

      await fetchWrapper.delete(mockUrl, {
        headers: expectedHeaders,
        body: body
      });

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
      it('should handle 401 with refresh token', async () => {
        const unauthorizedFetchResponse = {
          status: 401,
          ok: false,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ message: 'unauthorized' }),
        } as Response;

        const successfulFetchResponse = {
          status: 200,
          ok: true,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ message: 'hello world!' }),
        } as Response;

        global.fetch = vi
          .fn()
          .mockResolvedValueOnce(unauthorizedFetchResponse)
          .mockResolvedValueOnce(successfulFetchResponse);

        cookies.isKey = vi.fn().mockImplementation((keyName: string) => {
          return keyName === 'access_token' || keyName === 'refresh_token';
        });
        cookies.get = vi.fn().mockImplementation((keyName: string) => {
          switch (keyName) {
            case 'access_token':
              return 'old_access';
            case 'refresh_token':
              return 'old_refresh';
            default:
              return null;
          }
        });
        cookies.set = vi.fn();

        const authStore = useAuthStore();
        authStore.refreshAccessToken = vi.fn().mockResolvedValue({
          access_token: 'new_access',
          refresh_token: 'new_refresh',
        });

        await fetchWrapper.get(mockUrl);

        expect(cookies.set).toHaveBeenCalledWith('access_token', 'new_access', 3600);
        expect(cookies.set).toHaveBeenCalledWith('refresh_token', 'new_refresh');
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      it('should throw when 401 without refresh token', async () => {
        cookies.isKey = vi.fn().mockImplementation((keyName) => keyName === 'access_token');
        cookies.get = vi.fn().mockImplementation((keyName) => {
          if (keyName === 'access_token') return mockAccessToken;
          return null;
        });

        const unauthorizedFetchResponse = {
          status: 401,
          ok: false,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ message: 'unauthorized' }),
        } as Response;

        global.fetch = vi.fn().mockResolvedValueOnce(unauthorizedFetchResponse);
        const navigateSpy = vi.spyOn(router, 'push');

        await expect(fetchWrapper.get(mockUrl)).rejects.toThrow(); // should throw 401 error
        expect(navigateSpy).not.toHaveBeenCalled(); // no redirect when no refresh token
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
