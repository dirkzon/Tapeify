import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { usePlaylistsStore } from '@/stores/playlists'
import { useAlbumsStore } from './album'
import { usePaginationStore } from './pagination'

const STORE_NAME = 'search'

export const useSearchStore = defineStore(STORE_NAME, {
  persist: false,
  actions: {
    async SearchPlaylistsAndAlbums(query: string): Promise<void> {
      const playlistsStore = usePlaylistsStore()
      const albumsStore = useAlbumsStore()
      const paginationStore = usePaginationStore()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/search')
      url.searchParams.append('market', 'ES')
      url.searchParams.append('type', ['album', 'playlist'].join(','))
      url.searchParams.append('q', query)

      const limit = paginationStore.limit
      if (limit < 1 || limit > 50) throw new Error('Limit out of bounds')
      url.searchParams.append('limit', String(limit))

      const offset = paginationStore.offset
      if (offset < 0 || offset > 1000) throw new Error('Offset out of bounds')
      url.searchParams.append('offset', String(offset))

      const result = await fetchWrapper.get(url)

      playlistsStore.SetPlaylists(result['playlists']['items'])
      albumsStore.SetAlbums(result['albums']['items'])

      const nextPageAvailable =
        result['albums']['next'] == null && result['playlists']['next'] == null
      const previousPageAvailable =
        result['albums']['previous'] == null && result['playlists']['previous'] == null
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    }
  }
})
