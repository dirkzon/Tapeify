import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import type { GetAlbumResponse, GetAlbumTracksResponse, SearchResponse } from '@/types/spotify/responses'
import { ParseAlbumTrackDTO } from '@/parsers/trackDtoParser'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/api/clients'
import { useProfileStore } from './profile'
import type { AlbumDTO } from '@/types/spotify/dto'
import { ParseAlbumDTO } from '@/parsers/albumDtoParser'

export const useAlbumsStore = defineStore('albums', {
  actions: {
    async FetchAlbumTracks(albumId: string) {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassettesStore()

      const response = await apiClient.get<GetAlbumResponse>('/albums/' + albumId)
      const album = response.data

      const limit = album.tracks.limit
      const total = album.tracks.total
      let offset = album.tracks.offset

      const imageUrl = GetSmallestImage(album.images)

      while (offset < total) {

        const tracksResponse = await apiClient.get<GetAlbumTracksResponse>('/albums/' + albumId + '/tracks', {
          params: {
            limit,
            offset,
          },
        })

        for (const item of tracksResponse.data.items) {
          tracksStore.AddTrack(ParseAlbumTrackDTO(item, imageUrl))
        }

        offset += limit
      }

      cassetteStore.updateName('default', album.name)
    },
    async searchAlbums(query: string, limit: number = 10, offset: number = 0) {
      const profileStore = useProfileStore()

      const response = await apiClient.get<SearchResponse>('/search', {
        params: {
          q: query,
          type: 'album',
          market: profileStore.country,
          limit: limit,
          offset: offset,
        },
      })

      const albums = response.data.albums?.items.filter((album: AlbumDTO) => album).map((album: AlbumDTO) => { return ParseAlbumDTO(album) })

      return {
        albums: albums || [],
        next: response.data.albums?.next !== null && albums?.length > 0,
        previous: !!response.data.albums?.previous,
      }
    }
  }
})
