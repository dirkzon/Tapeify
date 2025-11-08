import type { Anchor, Track } from '@/types/tapeify/models'
import { defineStore } from 'pinia'

const STORE_NAME = 'tracks'

export const UseTracksStore = defineStore(STORE_NAME, {
  state: () => ({
    tracks: [] as Track[],
  }),
  getters: {
    getTracks(state): Track[] {
      return state.tracks
    },
    getTrackById: (state) => {
      return (id: string) => {
        return state.tracks.find(t => t.id == id)
      }
    },
  },
  actions: {
    AddTrack(track: Track) {
      this.tracks.push(track)
    },
    ClearTracks() {
      this.tracks = []
    },
  }
})
