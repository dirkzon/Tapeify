import { defineStore } from 'pinia'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { UseTracksStore } from './tracks'
import { GetSmallestImage } from '@/helpers/imageFunctions'

const STORE_NAME = 'playlists'

export interface Playlist {
  name: string
  id: string
  owner: string
  image?: URL
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
      for (const playlist of result['items']) {
        this.AddPlaylist({
          name: playlist['name'],
          id: playlist['id'],
          owner: playlist['owner']['display_name'],
          image: GetSmallestImage(playlist['images'])
        })
      }

      const nextPageAvailable = result['next'] != null
      const previousPageAvailable = result['previous'] != null
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    },
    AddPlaylist(playlist: Playlist) {
      this.playlists.push(playlist)
    },
    ClearPlaylists() {
      this.playlists = []
    },
    async SetPlaylistTracks(playlistId: string) {
      const tracksStore = UseTracksStore()
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlistId)
      const response = await fetchWrapper.get(url)

      for (const track of response['tracks']['items']) {
        const artists: string[] = []
        for (const artist of track['track']['artists']) {
          artists.push(artist['name'])
        }
        tracksStore.AddTrack({
          name: track['track']['name'],
          id: track['track']['id'],
          image: GetSmallestImage(track['track']['album']['images']),
          explicit: track['track']['explicit'],
          duration_ms: Number(track['track']['duration_ms']),
          artists: artists
        })
      }
    }
  }
})
