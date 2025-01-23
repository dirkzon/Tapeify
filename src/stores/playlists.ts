import { fetchWrapper } from '@/helpers/fetchWrapper'
import { defineStore } from 'pinia'

const STORE_NAME = 'playlist'

interface Playlist {
  name: string,
  id: string
}

export const usePlaylistsStore = defineStore(STORE_NAME, {
  persist: false,
  state: () => ({
    playlists: [] as Playlist[],
    nextPageAvailable: true,
    previousPageAvailable: false
  }),
  getters: {
    getPlaylists(state): Playlist[] {
      if (!state.playlists) return []
      return state.playlists
    }
  },
  actions: {
    async FetchUsersPlayists(limit?: number, offset?: number): Promise<void> {
      this.playlists = []

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/me/playlists')

      if (limit) {
        if (limit < 1 || limit > 50) throw new Error("Limit out of bounds")
        url.searchParams.append('limit', String(limit));
      }
      if (offset) {
        if (offset < 0 || offset > 100000) throw new Error("Offset out of bounds")
        url.searchParams.append('offset', String(offset));
      }

      const result = await fetchWrapper.get(url)
      const playlists = result['items'] 

      for (const playlist of playlists) {
        this.playlists.push({
          name: playlist['name'],
          id: playlist['id']
        })
      }

      this.nextPageAvailable = (result['next'] == null)
      this.previousPageAvailable = (result['previous'] == null)
    }
  }
})
