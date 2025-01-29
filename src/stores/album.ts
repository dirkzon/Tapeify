import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { GetSmallestImage } from '@/helpers/imageFunctions'

const STORE_NAME = 'albums'

export interface Album {
  name: string
  id: string
  artists: string[]
  image: URL
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SetAlbums(items: Array<any>) {
      for (const album of items) {
        if (album) {
          const artists: string[] = []
          for (const index in album['artists']) {
            artists.push(album['artists'][index]['name'])
          }
          this.albums.push({
            name: album['name'],
            id: album['id'],
            artists: artists,
            image: GetSmallestImage(album['images'])
          })
        }
      }
    },
    ClearAlbums() {
      this.albums = []
    },
    async FetchAlbumTracks(albumId: string) {
      const tracksStore = UseTracksStore()
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/albums/' + albumId)
      const response = await fetchWrapper.get(url)
      const albumImage = GetSmallestImage(response['images'])
      for (const track of response['tracks']['items']) {
        tracksStore.AddTrack({
          name: track['name'],
          id: track['id'],
          image: albumImage,
          explicit: track['explicit'],
          duration_ms: Number(track['duration_ms'])
        })
      }
    }
  }
})
