import { defineStore } from 'pinia'
import type { Anchor } from '@/types/tapeify/models'

export const useAnchorsStore = defineStore('anchors', {
  state: () => ({
    anchors: [] as Anchor[],
  }),

  getters: {
  },

  actions: {
    anchorTrack(anchor: Anchor) {
      if (this.anchors.find(a => a.trackId === anchor.trackId)) {
        const index = this.anchors.findIndex(a => a.trackId === anchor.trackId)
        this.anchors[index] = anchor
        return
      }
      this.anchors.push(anchor)
    }
  }
})
