import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { GetSmallestImage } from '@/utils/images/imageFunctions'
import { useCassetteStore } from './cassette'

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
    async SetAlbumTracks(albumId: string) {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassetteStore()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/albums/' + albumId)
      const response = await fetchWrapper.get(url)
      const albumImage = GetSmallestImage(response['images'])
      for (const track of response['tracks']['items']) {
        const artists: string[] = []
        for (const artist of track['artists']) {
          artists.push(artist['name'])
        }
        tracksStore.AddTrack({
          name: track['name'],
          id: track['id'],
          image: albumImage,
          explicit: track['explicit'],
          duration_ms: Number(track['duration_ms']),
          artists: artists,
          anchored: false,
          uri: track['uri']
        })
      }

      cassetteStore.SetCassetteName(response['name'])
    }
  }
})
