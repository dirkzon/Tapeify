import { defineStore } from 'pinia'
import { usePlaylistsStore } from './playlists'
import { useAlbumsStore } from './album'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import type { SearchResponse } from '@/types/spotify/responses'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'
import { ParseAlbumDTO } from '@/parsers/albumDtoParser'
import { useProfileStore } from './profile'

const STORE_NAME = 'search'

export const UseSearchStore = defineStore(STORE_NAME, {
  actions: {
    async SearchPlaylistsAndAlbums(query: string): Promise<void> {
      const profileStore = useProfileStore()
    
      const playlistsStore = usePlaylistsStore()
      const albumsStore = useAlbumsStore()
      const paginationStore = usePaginationStore()

      albumsStore.ClearAlbums()
      playlistsStore.ClearPlaylists()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/search')
      const country = profileStore.country || "ES";
      url.searchParams.append('market', country)
      url.searchParams.append('type', ['album', 'playlist'].join(','))
      url.searchParams.append('q', query)

      const limit = paginationStore.getLimit
      if (limit < 1 || limit > 50) throw new Error('Limit out of bounds')
      url.searchParams.append('limit', String(limit))

      const offset = paginationStore.getOffset
      if (offset < 0 || offset > 1000) throw new Error('Offset out of bounds')
      url.searchParams.append('offset', String(offset))

      const result = await fetchWrapper.get<SearchResponse>(url)

      for (const playlist of result.playlists.items) {
        if (playlist) playlistsStore.AddPlaylist(ParsePlaylistDTO(playlist))
      }

      for (const album of result.albums.items) {
        if (album) albumsStore.AddAlbum(ParseAlbumDTO(album))
      }

      const nextPageAvailable = !!(result.albums.next && result.playlists.next);
      const previousPageAvailable = !!(result.albums.previous && result.playlists.previous);
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    }
  }
})
