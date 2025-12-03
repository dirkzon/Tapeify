import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import type { GetAlbumResponse, GetAlbumTracksResponse } from '@/types/spotify/responses'
import { ParseAlbumTrackDTO } from '@/parsers/trackDtoParser'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import type { Album } from '@/types/tapeify/models'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/utils/api/clients'

const STORE_NAME = 'albums'

export const useAlbumsStore = defineStore(STORE_NAME, {
  state: () => ({
    albums: [] as Album[]
  }),
  getters: {},
  actions: {
    AddAlbum(album: Album) {
      this.albums.push(album)
    },
    ClearAlbums() {
      this.albums = []
    },
    async FetchAlbumTracks(albumId: string) {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassettesStore()

      const album = (await apiClient.get<GetAlbumResponse>('/albums/' + albumId)).data

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
