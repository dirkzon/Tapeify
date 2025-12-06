import { defineStore } from 'pinia'
import { usePlaylistsStore } from './playlists'
import { useAlbumsStore } from './album'
import { usePaginationStore } from './pagination'
import type { SearchResponse } from '@/types/spotify/responses'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'
import { ParseAlbumDTO } from '@/parsers/albumDtoParser'
import { useProfileStore } from './profile'
import { apiClient } from '@/api/clients'

export const UseSearchStore = defineStore('search', {
  actions: {
    async SearchPlaylistsAndAlbums(query: string): Promise<void> {
      const profileStore = useProfileStore()
    
      const playlistsStore = usePlaylistsStore()
      const albumsStore = useAlbumsStore()
      const paginationStore = usePaginationStore()

      albumsStore.ClearAlbums()
      playlistsStore.ClearPlaylists()

      const response = await apiClient.get<SearchResponse>('/search', {
        params: {
          q: query,
          type: 'album,playlist',
          market: profileStore.country,
          limit: paginationStore.limit,
          offset: paginationStore.offset,
        },
      })

      const data = response.data

      for (const playlist of data.playlists.items) {
        if (playlist) playlistsStore.AddPlaylist(ParsePlaylistDTO(playlist))
      }

      for (const album of data.albums.items) {
        if (album) albumsStore.AddAlbum(ParseAlbumDTO(album))
      }

      const nextPageAvailable = !!(data.albums.next && data.playlists.next);
      const previousPageAvailable = !!(data.albums.previous && data.playlists.previous);
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    }
  }
})
