import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { useCassetteStore } from './cassette'
import type { GetAlbumResponse, GetAlbumTracksResponse } from '@/types/spotify/responses'
import { ParseAlbumTrackDTO } from '@/parsers/trackDtoParser'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import type { Album } from '@/types/tapeify/models'

const STORE_NAME = 'albums'

export const useAlbumsStore = defineStore(STORE_NAME, {
  state: () => ({
    albums: [] as Album[]
  }),
  getters: {
    getAlbums(state): Album[] {
      return state.albums
    }
  },
  actions: {
    AddAlbum(album: Album) {
      this.albums.push(album)
    },
    ClearAlbums() {
      this.albums = []
    },
    async FetchAlbumTracks(albumId: string) {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassetteStore()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/albums/' + albumId)
      const album = await fetchWrapper.get<GetAlbumResponse>(url)

      const limit = album.tracks.limit
      const total = album.tracks.total
      let offset = album.tracks.offset

      const imageUrl = GetSmallestImage(album.images)

      while (offset < total) {
        const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/albums/' + albumId + '/tracks')
        url.searchParams.append('limit', String(limit))
        url.searchParams.append('offset', String(offset))

        const tracks = await fetchWrapper.get<GetAlbumTracksResponse>(url)

        for (const item of tracks.items) {
          tracksStore.AddTrack(ParseAlbumTrackDTO(item, imageUrl))
        }

        offset += limit
      }

      cassetteStore.SetCassetteName(album.name)
    }
  }
})
