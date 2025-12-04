import { authApiClient } from '@/api/clients';
import type { TokenResponse } from '@/types/spotify/responses';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './auth';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/api/clients');
vi.mock('../router', () => ({
  default: { push: vi.fn() }
}));

describe('Auth store', () => {
  const tokenResponseMock: TokenResponse = {
    access_token: '0123456789',
    token_type: 'access_token',
    scope: 'user-read-private user-read-email',
    expires_in: 3600,
    refresh_token: '9876543210'
  };

  const mockTime = new Date('2025-12-04T00:00:00Z');
  const postSpy = vi.spyOn(authApiClient, 'post');

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.useFakeTimers();
    vi.setSystemTime(mockTime);

    vi.mocked(authApiClient.post).mockResolvedValue({ data: tokenResponseMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('requestAccessToken', () => {
    it('successfully requests access token and calls API with correct args', async () => {
      const authStore = useAuthStore();
      const code = 'secretcode';

      expect(authStore.accessToken).not.toBeDefined();
      expect(authStore.refreshToken).not.toBeDefined();
      expect(authStore.expiresAt).not.toBeDefined();

      await authStore.requestAccessToken(code);

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        '/api/token',
        'grant_type=authorization_code&code=secretcode&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173%2FTapeify%2Fcallback',
        {
          headers: {
            Authorization: 'Basic MDEyMzQ1Njc4OTo3NGJkNDY2NTE1MDQ0M2QyYmY0MzhhNGM0YTViYmNiNw=='
          }
        }
      );

      expect(authStore.accessToken).toEqual(tokenResponseMock.access_token);
      expect(authStore.refreshToken).toEqual(tokenResponseMock.refresh_token);
      const expectedTime = mockTime.getTime() + tokenResponseMock.expires_in * 1000;
      expect(authStore.expiresAt).toEqual(expectedTime);
    });
  });
  describe('refreshAccessToken', () => {
    it('successfully refresh access token and calls API with correct args', async () => {
      const authStore = useAuthStore();

      authStore.refreshToken = '9876543210';

      expect(authStore.accessToken).not.toBeDefined();
      expect(authStore.refreshToken).toBeDefined();
      expect(authStore.expiresAt).not.toBeDefined();

      await authStore.refreshAccessToken();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        '/api/token',
        'grant_type=refresh_token&refresh_token=9876543210&client_id=0123456789',
        {
          headers: {
            Authorization: 'Basic MDEyMzQ1Njc4OTo3NGJkNDY2NTE1MDQ0M2QyYmY0MzhhNGM0YTViYmNiNw=='
          }
        }
      );

      expect(authStore.accessToken).toEqual(tokenResponseMock.access_token);
      expect(authStore.refreshToken).toEqual(tokenResponseMock.refresh_token);
      const expectedTime = mockTime.getTime() + tokenResponseMock.expires_in * 1000;
      expect(authStore.expiresAt).toEqual(expectedTime);
    });
  });
});
