import { defineStore } from 'pinia'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { UseTracksStore } from './tracks'
import { GetSmallestImage } from '@/utils/images/imageFunctions'
import { useProfileStore } from './profile'
import { useCassetteStore } from './cassette'

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
      const cassetteStore = useCassetteStore()

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
          artists: artists,
          anchored: false,
          uri: track['track']['uri']
        })
      }

      cassetteStore.SetCassetteName(response['name'])
    },
    async UploadNewPlaylist(name: String, description: String, is_public: Boolean) {
      const profileStore = useProfileStore()
      const userId = profileStore.id

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/users/' + userId + '/playlists')
      let body = new Map<String, any>()

      if (name.length < 1 || name.length > 30) throw new Error('Name must be between 1 and 30 characters.')
      body.set('name', String(name))

      if (description.length < 1 || description.length > 200) throw new Error('Description must be between 1 and 30 characters.')
      body.set('description', String(description))

      body.set('public', is_public)

      return await fetchWrapper.post(url, JSON.stringify(Object.fromEntries(body)))
    },
    async UploadTracksToPlaylists(playlist_id: String, track_uris: String[]) {
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlist_id + '/tracks')
      let body = new Map<String, any>()
  
      if (track_uris.length > 100) throw new Error('Cannot upload more than 100 tracks to a playlist at once.')
      body.set('uris', track_uris)

      body.set('position', 0)

      return await fetchWrapper.post(url, JSON.stringify(Object.fromEntries(body)))
    }
  }
})
