import { defineStore } from 'pinia'
import { usePlaylistsStore } from './playlists'
import { useAlbumsStore } from './album'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { GetSmallestImage } from '@/helpers/imageFunctions'

const STORE_NAME = 'search'

export const UseSearchStore = defineStore(STORE_NAME, {
  actions: {
    async SearchPlaylistsAndAlbums(query: string): Promise<void> {
      const playlistsStore = usePlaylistsStore()
      const albumsStore = useAlbumsStore()
      const paginationStore = usePaginationStore()

      albumsStore.ClearAlbums()
      playlistsStore.ClearPlaylists()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/search')
      url.searchParams.append('market', 'ES')
      url.searchParams.append('type', ['album', 'playlist'].join(','))
      url.searchParams.append('q', query)

      const limit = paginationStore.getLimit
      if (limit < 1 || limit > 50) throw new Error('Limit out of bounds')
      url.searchParams.append('limit', String(limit))

      const offset = paginationStore.getOffset
      if (offset < 0 || offset > 1000) throw new Error('Offset out of bounds')
      url.searchParams.append('offset', String(offset))

      const result = await fetchWrapper.get(url)

      for (const playlist of result['playlists']['items']) {
        if (playlist) {
          playlistsStore.AddPlaylist({
            name: playlist['name'],
            id: playlist['id'],
            owner: playlist['owner']['display_name'],
            image: GetSmallestImage(playlist['images'])
          })
        }
      }
      albumsStore.SetAlbums(result['albums']['items'])

      const nextPageAvailable =
        result['albums']['next'] != null && result['playlists']['next'] != null
      const previousPageAvailable =
        result['albums']['previous'] != null && result['playlists']['previous'] != null
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    }
  }
})
