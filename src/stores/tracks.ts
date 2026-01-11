import type { Track } from '@/types/tapeify/models'
import { defineStore } from 'pinia'

export const UseTracksStore = defineStore('tracks', {
  state: () => ({
    tracks: [] as Track[],
  }),
  getters: {
    totalDuration(state): number {
      return state.tracks.reduce((acc, track) => acc + track.durationMs, 0)
    }
  },
  actions: {
    AddTrack(track: Track) {
      this.tracks.push(track)
    },
    ClearTracks() {
      this.tracks = []
    },
    GetTrackById(trackId: string): Track | undefined {
      return this.tracks.find(track => track.id === trackId)
    }
  }
})
