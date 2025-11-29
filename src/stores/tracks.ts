import type { Track } from '@/types/tapeify/models'
import { defineStore } from 'pinia'

export const UseTracksStore = defineStore('tracks', {
  state: () => ({
    tracks: [] as Track[],
  }),
  getters: {
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
