import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { usePlaylistsStore } from './playlists'
import type { CassetteSide } from '@/types/tapeify/models'

const STORE_NAME = 'cassette'

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
    },
    getSidePrettyDurtionByIndex: (state) => {
      return (index: number) => {
        const ms = state.sides[index].duration_ms
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)

        if (hours >= 1) {
            return `${hours} hr ${minutes} min`
        } else {
            return `${minutes} min ${seconds} sec`
        }
      }
    },
    getSideTracksByIndex: (state) => {
      return (index: number) => {
        return state.sides[index].tracks
      }
    },
    getSideNameByIndex: (state) => {
      return (index: number) => {
        return state.sides[index].name
      }
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
      const trackStore = UseTracksStore()

      for (var track of this.sides[index].tracks) {
        if (track.anchored) {
            trackStore.UnAnchorTrack(track.id)
        }
      }
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

          const trackUris: string[] = side.tracks.map(t => t.uri)

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
