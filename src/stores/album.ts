import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import { useCassetteStore } from './cassette'
import type { GetAlbumResponse } from '@/types/spotify/responses'
import { GetAlbumArtists } from '@/utils/artists/artistUtils'

const STORE_NAME = 'albums'

export interface Album {
  name: string
  id: string
  artists: string[]
  image?: URL
}

export const useAlbumsStore = defineStore(STORE_NAME, {
  state: () => ({
    albums: [] as Album[]
  }),
  getters: {
    getAlbums(state): Album[] {
      if (!state.albums) return []
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

      for (const track of album.tracks.items) {
        tracksStore.AddTrack({
          name: track.name,
          id: track.id,
          image: GetSmallestImage(album.images),
          explicit: track.explicit,
          duration_ms: track.duration_ms,
          artists: GetAlbumArtists(album),
          anchored: false,
          uri: track.uri
        })
      }

      cassetteStore.SetCassetteName(album.name)
    }
  }
})
