import { defineStore } from 'pinia'

const STORE_NAME = 'tracks'

export interface Track {
  name: string
  id: string
  image?: URL
  explicit: boolean
  duration_ms: number
  artists: string[]
}

export const UseTracksStore = defineStore(STORE_NAME, {
  state: () => ({
    tracks: [] as Track[]
  }),
  getters: {
    getTracks(state): Track[] {
      return state.tracks
    }
  },
  actions: {
    AddTrack(track: Track) {
      this.tracks.push(track)
    },
    ClearTracks() {
      this.tracks = []
    }
  }
})
