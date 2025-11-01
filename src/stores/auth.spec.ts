import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'

describe('Auth Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
    fetchWrapper.post = vi.fn().mockReturnThis()
  })

  describe('gettters', () => {
    it('userAuthorizationUrl', () => {
      const authStore = useAuthStore()
      const authorizationUrl = authStore.userAuthorizationUrl
      const searchParams = authorizationUrl.searchParams

      expect(searchParams.has('response_type')).toBeTruthy()
      expect(searchParams.get('response_type')).toBe('code')
      expect(searchParams.has('client_id')).toBeTruthy()
      expect(searchParams.has('scope')).toBeTruthy()
      expect(searchParams.has('redirect_uri')).toBeTruthy()
    })
  })

  describe('actions', () => {
    it('requestAccessToken', async () => {
      const fetchWrapperSpy = vi.spyOn(fetchWrapper, 'post')

      const authStore = useAuthStore()
      await authStore.requestAccessToken('code')

      expect(fetchWrapperSpy).toBeCalled()

      const call = fetchWrapperSpy.mock.calls[0];

      //url
      expect(fetchWrapperSpy.mock.calls[0][0].href).toBe('https://accounts.spotify.com/api/token')
      //body
      const requestBody = call[1]!.body;
      if (requestBody == null) {
        throw new Error('request body is null or undefined')
      }
      const body = new URLSearchParams(requestBody as any);
      expect(body.get('grant_type')).toBe('authorization_code')
      expect(body.get('code')).toStrictEqual(expect.any(String))
      expect(body.get('redirect_uri')).toStrictEqual(expect.any(String))
      
      //headers
      const headerHeaders = call[1]!.headers;
      if (headerHeaders == null) {
        throw new Error('request body is null or undefined')
      }
      const headers = new URLSearchParams(headerHeaders as any);
      expect(headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded'
      )
      expect(headers.get('Authorization')).toStrictEqual(
        expect.any(String)
      )
    })
    it('refreshAccessToken', async () => {
      const fetchWrapperSpy = vi.spyOn(fetchWrapper, 'post')

      const authStore = useAuthStore()
      await authStore.refreshAccessToken('refresh_token')

      const call = fetchWrapperSpy.mock.calls[0];

      //body
      const requestBody = call[1]!.body;
      if (requestBody == null) {
        throw new Error('request body is null or undefined')
      }
      const body = new URLSearchParams(requestBody as any);
      expect(body.get('grant_type')).toBe('refresh_token')
      expect(body.get('client_id')).toStrictEqual(expect.any(String))
      expect(body.get('refresh_token')).toStrictEqual(expect.any(String))
    
      expect(body.get('client_id')).toStrictEqual(expect.any(String))
      expect(body.get('refresh_token')).toStrictEqual(expect.any(String))
      
      //headers
      const requestHeaders = call[1]!.headers;
      if (requestHeaders == null) {
        throw new Error('request body is null or undefined')
      }
      const headers = new URLSearchParams(requestHeaders as any);
      
      expect(headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded'
      )
    })
  })
})
