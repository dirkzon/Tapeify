import { authApiClient } from '@/api'
import type { TokenResponse } from '@/types/spotify/responses'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'

vi.mock('../router', () => ({
  default: { push: vi.fn() },
}))

vi.mock('@/api', () => ({
  authApiClient: {
    post: vi.fn(),
  },
}))

vi.mock('@vueuse/core', () => {
  return {
    useStorage: (key: string, initial: any, storage?: Storage) => {
      return ref(initial)
    },
  }
})

const mockedPost = vi.mocked(authApiClient.post)

describe('Auth store', () => {
  const tokenResponseMock: TokenResponse = {
    access_token: '0123456789',
    token_type: 'access_token',
    scope: 'user-read-private user-read-email',
    expires_in: 3600,
    refresh_token: '9876543210',
  }

  const mockTime = new Date('2025-12-04T00:00:00Z')

  beforeEach(() => {
    setActivePinia(createPinia())

    vi.useFakeTimers()
    vi.setSystemTime(mockTime)

    mockedPost.mockResolvedValue({ data: tokenResponseMock } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    
  })

  describe('requestAccessToken', () => {
    it('requests access token and updates store correctly', async () => {
      const authStore = useAuthStore()
      const code = 'secretcode'

      expect(authStore.accessToken).toBeUndefined()
      expect(authStore.refreshToken).toBeUndefined()
      expect(authStore.expiresAt).toBeUndefined()

      authStore.codeVerifier = 'test-code-verifier'

      await authStore.requestAccessToken(code)

      expect(mockedPost).toHaveBeenCalledTimes(1)

      expect(mockedPost).toHaveBeenCalledWith(
        '/api/token',
        expect.stringContaining('grant_type=authorization_code'),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      expect(authStore.accessToken).toBe(tokenResponseMock.access_token)
      expect(authStore.refreshToken).toBe(tokenResponseMock.refresh_token)

      const expectedTime =
        mockTime.getTime() + tokenResponseMock.expires_in * 1000

      expect(authStore.expiresAt).toBe(expectedTime)
    })
  })

  describe('refreshAccessToken', () => {
    it('refreshes access token correctly', async () => {
      const authStore = useAuthStore()

      authStore.refreshToken = '9876543210'

      expect(authStore.accessToken).toBeUndefined()
      expect(authStore.refreshToken).toBeDefined()
      expect(authStore.expiresAt).toBeUndefined()

      await authStore.refreshAccessToken()

      expect(mockedPost).toHaveBeenCalledTimes(1)

      expect(mockedPost).toHaveBeenCalledWith(
        '/api/token',
        expect.stringContaining('grant_type=refresh_token'),
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
            )}`,
          },
        }
      )

      expect(authStore.accessToken).toBe(tokenResponseMock.access_token)
      expect(authStore.refreshToken).toBe(tokenResponseMock.refresh_token)

      const expectedTime =
        mockTime.getTime() + tokenResponseMock.expires_in * 1000

      expect(authStore.expiresAt).toBe(expectedTime)
    })
  })

  describe('accessTokenExpired', () => {
    it('returns true when expiresAt is undefined', () => {
      const authStore = useAuthStore()
      authStore.expiresAt = undefined
      expect(authStore.accessTokenExpired).toBe(true)
    })

    it('returns true when expired', () => {
      const authStore = useAuthStore()
      authStore.expiresAt = mockTime.getTime() - 1000
      expect(authStore.accessTokenExpired).toBe(true)
    })

    it('returns false when not expired', () => {
      const authStore = useAuthStore()
      authStore.expiresAt = mockTime.getTime() + 1000
      expect(authStore.accessTokenExpired).toBe(false)
    })
  })

  describe('generateUserAuthorizationUrl', () => {
    it('builds correct Spotify authorization URL', async () => {
      const authStore = useAuthStore()

      // mock crypto-dependent functions
      authStore._generateCodeVerifier = vi.fn().mockReturnValue('verifier')
      authStore._hashCodeVerifier = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(32))
      authStore._generateCodeChallenge = vi.fn().mockReturnValue('challenge')

      const url = await authStore.generateUserAuthorizationUrl()

      expect(url.origin + url.pathname).toBe(
        'https://accounts.spotify.com/authorize'
      )

      const params = url.searchParams

      expect(params.get('response_type')).toBe('code')
      expect(params.get('client_id')).toBe(import.meta.env.VITE_CLIENT_ID)
      expect(params.get('redirect_uri')).toBe(
        import.meta.env.VITE_REDIRECT_URI
      )
      expect(params.get('code_challenge_method')).toBe('S256')
      expect(params.get('code_challenge')).toBe('challenge')

      expect(params.has('expires_at')).toBe(false)
    })
  })
})