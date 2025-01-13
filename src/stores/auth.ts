import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    getters: {
        userAuthorizationUrl: () => {
            const url = new URL(import.meta.env.VITE_SPOTIFY_AUTH_URI);
            const searchParams = new URLSearchParams();
            searchParams.append('response_type', 'code');
            searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID);
            searchParams.append('scope', 'user-read-private user-read-email playlist-read-private');
            searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
            url.search = searchParams.toString();
            return url.toString();
        }
    }
});
