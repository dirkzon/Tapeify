import { defineStore } from 'pinia'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { UseTracksStore } from './tracks'

const STORE_NAME = 'playlists'

export interface Playlist {
  name: string
  id: string
  owner: string
  image: URL
}

export const usePlaylistsStore = defineStore(STORE_NAME, {
  state: () => ({
    playlists: [] as Playlist[]
  }),
  getters: {
    getPlaylists(state): Playlist[] {
      if (!state.playlists) return []
      return state.playlists
    }
  },
  actions: {
    async FetchUsersPlayists(): Promise<void> {
      const paginationStore = usePaginationStore()

      this.ClearPlaylists()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/me/playlists')

      const limit = paginationStore.getLimit
      if (limit < 1 || limit > 50) throw new Error('Limit out of bounds')
      url.searchParams.append('limit', String(limit))

      const offset = paginationStore.getOffset
      if (offset < 0 || offset > 10000) throw new Error('Offset out of bounds')
      url.searchParams.append('offset', String(offset))

      const result = await fetchWrapper.get(url)
      this.SetPlaylists(result['items'])

      const nextPageAvailable = result['next'] != null
      const previousPageAvailable = result['previous'] != null
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SetPlaylists(items: Array<any>) {
      for (const playlist of items) {
        if (playlist) {
          const numImages = playlist['images'].length
          this.playlists.push({
            name: playlist['name'],
            id: playlist['id'],
            owner: playlist['owner']['display_name'],
            image: new URL(playlist['images'][numImages - 1]['url'])
          })
        }
      }
    },
    ClearPlaylists() {
      this.playlists = []
    },
    async FetchPlaylistTracks(playlistId: string) {
      const tracksStore = UseTracksStore()
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlistId)
      const response = await fetchWrapper.get(url)

      for (const track of response['tracks']['items']) {
        const numImages = track['track']['album']['images'].length
        tracksStore.AddTrack({
          name: track['track']['name'],
          id: track['track']['id'],
          image: new URL(track['track']['album']['images'][numImages - 1]['url']),
          explicit: track['track']['explicit'],
          duration_ms: Number(track['track']['duration_ms'])
        })
      }
    }
  }
})
