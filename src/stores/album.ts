import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import type { GetAlbumResponse, GetAlbumTracksResponse } from '@/types/spotify/responses'
import { ParseAlbumTrackDTO } from '@/parsers/trackDtoParser'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/api/clients'

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

      cassetteStore.updateName('cassette-1', album.name)
    }
  }
})
