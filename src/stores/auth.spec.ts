import { authApiClient } from '@/api/clients';
import type { TokenResponse } from '@/types/spotify/responses';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './auth';
import { createPinia, setActivePinia } from 'pinia';

vi.mock("../api/clients");
vi.mock('../router', () => ({
  default: {
    push: vi.fn()
  }
}))
setActivePinia(createPinia());

describe('Auth store', () => {
  const tokenResponseMock: TokenResponse = {
    access_token: '0123456789',
    token_type: 'access_token',
    scope: 'user-read-private user-read-email',
    expires_in: 3600,
    refresh_token: '9876543210'
  };

  beforeEach(() => {
    vi.mocked(authApiClient.post).mockResolvedValueOnce({ data: tokenResponseMock });
  });

  describe('requestAccessToken', () => {
    it('successfully requests access token', async () => {
      const mockTime = new Date('2025-12-04T00:00:00Z');
      vi.setSystemTime(mockTime);

      const authStore = useAuthStore();
      const code = "secretcode";

      await authStore.requestAccessToken(code);

      expect(authStore.accessToken).toBeDefined();
      expect(authStore.accessToken).toEqual(tokenResponseMock.access_token)
      
      expect(authStore.refreshToken).toBeDefined();
      expect(authStore.refreshToken).toEqual(tokenResponseMock.refresh_token)

      expect(authStore.expiresAt).toBeDefined();
      const expectedTime = mockTime.getTime() + tokenResponseMock.expires_in * 1000
      expect(authStore.expiresAt).toEqual(expectedTime)
    });
  });
});
