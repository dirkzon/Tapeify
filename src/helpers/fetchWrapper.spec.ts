import { fetchWrapper } from '@/helpers/fetchWrapper'
import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, vi, it, beforeEach, afterAll } from "vitest";
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()


describe('Fetchwrapper Tests', () => {
    const mockUrl = new URL('https://test.com/')
    const mockAccessToken = '0123456789'

    const successfullFetchResponse = {
        status: 200,
        json: async () => ({
            test: "hello world!",
        })
    } as Response

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })
    
    it('Set access token cookie', async () => {
        const expectedHeaders = new Headers();
        expectedHeaders.append('Authorization', 'Bearer ' + mockAccessToken);

        cookies.get = vi.fn().mockReturnValue(mockAccessToken)
        cookies.isKey = vi.fn().mockReturnValue(true)

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
})