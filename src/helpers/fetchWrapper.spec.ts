import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore } from '@/stores/auth';
import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, vi, it, beforeEach, afterAll } from "vitest";
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

describe('Fetchwrapper Tests', () => {
    const mockUrl = new URL('https://test.com/')
    const mockAccessToken = '0123456789'
    const mockRefreshToken = '9876543210'

    const successfullFetchResponse = {
        status: 200,
        ok: true,
        json: async () => ({
            message: "hello world!",
        })
    } as Response

    beforeEach(() => {
        setActivePinia(createPinia())
        cookies.get = vi.fn().mockImplementation((keyName: string) => {
            switch(keyName) {
                case 'access_token':
                    return mockAccessToken
                case 'refresh_token':
                    return mockRefreshToken
            }
        })
        cookies.set = vi.fn().mockImplementation(() => '')
        cookies.isKey = vi.fn().mockImplementation((keyName: string) => {
            switch(keyName) {
                case 'access_token':
                    return true
                case 'refresh_token':
                    return true
            }
        })
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })
    
    it('Set access token cookie', async () => {
        const expectedHeaders = new Headers();
        expectedHeaders.append('Authorization', 'Bearer ' + mockAccessToken);

        global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse)
        const fetchSpy = vi.spyOn(global, 'fetch')

        await fetchWrapper.get(mockUrl)
        expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
            mockUrl,
            {
              method: 'GET',
              headers: expectedHeaders,
              body: undefined,
            }
        );
    })

    describe('Api calls', () => {
        const expectedHeaders = new Headers();
        expectedHeaders.append('test', 'header');

        const expectedBody = new URLSearchParams()
        expectedBody.append('test', 'body')

        cookies.isKey = vi.fn().mockReturnValue(false);

        it('GET', async () => {
            const fetchSpy = vi.spyOn(global, 'fetch');
            global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse);

            await fetchWrapper.get(mockUrl, expectedHeaders);

            expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
                mockUrl,
                expect.objectContaining({
                method: 'GET',
                headers: expectedHeaders,
                body: undefined,
                })
            );
        })
        it('POST', async () => {
            global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse);

            const fetchSpy = vi.spyOn(global, 'fetch');

            await fetchWrapper.post(mockUrl, expectedBody, expectedHeaders);
            expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
                mockUrl,
                expect.objectContaining({
                method: 'POST',
                headers: expectedHeaders,
                body: expectedBody,
                })
            );
        })
        it('PUT', async () => {
            global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse);

            const fetchSpy = vi.spyOn(global, 'fetch');

            await fetchWrapper.put(mockUrl, expectedBody, expectedHeaders);
            expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
                mockUrl,
                expect.objectContaining({
                method: 'PUT',
                headers: expectedHeaders,
                body: expectedBody,
                })
            );
        })
        it('DELETE', async () => {
            global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse);

            const fetchSpy = vi.spyOn(global, 'fetch');

            await fetchWrapper.delete(mockUrl, expectedBody, expectedHeaders);
            expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
                mockUrl,
                expect.objectContaining({
                method: 'DELETE',
                headers: expectedHeaders,
                body: expectedBody,
                })
            )
        })
    })

    describe('Handle response', () => {
        it('Successfull', async () => {
            global.fetch = vi.fn().mockResolvedValue(successfullFetchResponse)

            const result = await fetchWrapper.get(mockUrl);
            expect(result).toStrictEqual({
                message: 'hello world!'
            })
        })
        describe('Unsuccessful', () => {
            it('401 with refresh token', async () => {
                cookies.isKey = vi.fn().mockReturnValue(true)
                const unauthorizedFetchResponse = {
                    status: 401,
                    ok: false,
                    json: async () => ({
                        message: "unauthorized",
                    })
                } as Response
                global.fetch = vi.fn().mockResolvedValue(unauthorizedFetchResponse)

                const authStore = useAuthStore()
                authStore.refreshAccessToken = vi.fn().mockResolvedValue({
                    access_token: 'new_access',
                    refresh_token: 'new_refresh'
                })

                await fetchWrapper.get(mockUrl);

                const setCookieSpy = vi.spyOn(cookies, 'set');
                expect(setCookieSpy).toBeCalledTimes(2)

                const fetchSpy = vi.spyOn(global, 'fetch');
                expect(fetchSpy).toBeCalled()
            })
        })
    })
})
