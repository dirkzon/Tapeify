import { defineStore } from 'pinia'
import type { SearchResponse } from '@/types/spotify/responses'
import { useProfileStore } from './profile'
import { apiClient } from '@/api/clients'
import type { SearchResult } from '@/types/tapeify/models'
import type { AlbumDTO, PlaylistDTO } from '@/types/spotify/dto'
import { ParseAlbumDTO } from '@/parsers/albumDtoParser'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'

export const UseSearchStore = defineStore('search', {
  actions: {
    async SearchPlaylistsAndAlbums(query: string, limit: number = 10, offset: number = 0): Promise<SearchResult> {
      const profileStore = useProfileStore()

      const response = await apiClient.get<SearchResponse>('/search', {
        params: {
          q: query,
          type: 'album,playlist',
          market: profileStore.country,
          limit: limit,
          offset: offset,
        },
      })

      const albums = response.data.albums?.items.filter((album: AlbumDTO) => album).map((album: AlbumDTO) => { return ParseAlbumDTO(album) })
      const playlists = response.data.playlists?.items.filter((playlist: PlaylistDTO) => playlist).map((playlist: PlaylistDTO) => { return ParsePlaylistDTO(playlist) })

      return {
        albums: albums || [],
        playlists: playlists || [],
        next: !!response.data.albums?.next || !!response.data.playlists?.next,
        previous: !!response.data.albums?.previous || !!response.data.playlists?.previous,
      }
    }
  }
})
