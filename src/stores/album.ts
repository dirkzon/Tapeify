import { defineStore } from 'pinia'

const STORE_NAME = 'album'

interface Album {
  name: string,
  id: string,
  artists: string[],
  image: string
}

export const useAlbumsStore = defineStore(STORE_NAME, {
  persist: false,
  state: () => ({
    albums: [] as Album[],
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
        this.ClearAlbums()  
        for (const album of items) {
            if(album){
                const artists: string[] = []
                for(const index in album['artists']) {
                artists.push(album['artists'][index]['name'])
                }
        
                this.albums.push({
                name: album['name'],
                id: album['id'],
                artists: artists,
                image: album['images'][0]['url']
                })
            }
        }
    },
    ClearAlbums(){
        this.albums = []
    }
  }
})
