import { defineStore } from 'pinia'

export const useUnusedTracksStore = defineStore('unused-tracks', {
  state: () => ({
    trackIds: [] as string[],
  }),
  actions: {
    addUnusedTrack(trackId: string) {
      if (!this.trackIds.includes(trackId)) {
        this.trackIds.push(trackId)
      }
    },
    removeUnusedTrack(trackId: string) {
      this.trackIds = this.trackIds.filter(id => id !== trackId)
    },
    clearUnusedTracks() {
      this.trackIds = []
    }
  }
})
