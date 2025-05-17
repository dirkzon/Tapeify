import { defineStore } from 'pinia'
import { type Track } from './tracks'
import { usePlaylistsStore } from './playlists'

const STORE_NAME = 'cassette'

export interface CassetteSide {
  tracks: Track[]
  duration_ms: number
  name: String
}

export const useCassetteStore = defineStore(STORE_NAME, {
  state: () => ({
    name: '',
    sides: [
      {
        tracks: [],
        duration_ms: 0,
        name: 'A'
      },
      {
        tracks: [],
        duration_ms: 0,
        name: 'B'
      }
    ] as CassetteSide[]
  }),
  getters: {
    getSides(state): CassetteSide[] {
      return state.sides
    }
  },
  actions: {
    ClearCassette() {
      this.sides = []
    },
    PushNewSide(newSide: CassetteSide) {
      this.sides.push(newSide)
    },
    AddEmptySide() {
      const index = this.sides.length
      this.sides.push({
        tracks: [],
        duration_ms: 0,
        name: String.fromCharCode(97 + index).toUpperCase()
      })
    },
    DeleteSide(index: number) {
      this.sides.splice(index, 1)
    },
    ResetSides() {
      this.sides = [
        {
          tracks: [],
          duration_ms: 0,
          name: 'A'
        },
        {
          tracks: [],
          duration_ms: 0,
          name: 'B'
        }
      ] as CassetteSide[]
    },
    SetCassetteName(name: string) {
      this.name = name
    },
    async UploadCassette() {
      const playlistStore = usePlaylistsStore()

      const description = "Made with Tapify"

      for (let side of this.sides) {
        if (side.duration_ms > 0) {
          const newPlaylist = await playlistStore.UploadNewPlaylist(`${this.name} | side ${side.name}`, description, false)

          const trackUris: String[] = side.tracks.map(t => t.uri)

          const trackBatchSize = 50
          let offset = 0

          while (offset < trackUris.length) {
            const urisToUpload = trackUris.slice(offset, offset + trackBatchSize)
            playlistStore.UploadTracksToPlaylists(newPlaylist.id, urisToUpload)
            offset += trackBatchSize
          }
        }
      }
    }
  }
})
