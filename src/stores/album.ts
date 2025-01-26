import { defineStore } from 'pinia'

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
            image: new URL(album['images'][0]['url'])
          })
        }
      }
    },
    ClearAlbums() {
      this.albums = []
    }
  }
})
