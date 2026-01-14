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
    },
    removeAnchor(trackId: string) {
      this.anchors = this.anchors.filter(anchor => anchor.trackId !== trackId)
    },
    removeAnchoresByCassetteId(cassetteId: string) {
      this.anchors = this.anchors.filter(anchor => anchor.cassetteId !== cassetteId)
    },
    removeAnchorsByTapeSide(cassetteId: string, sideIndex: number) {
      this.anchors = this.anchors.filter(anchor => !(anchor.cassetteId === cassetteId && anchor.sideIndex === sideIndex))
    },
    isTrackAnchored(trackId: string): boolean {
      return this.anchors.some(anchor => anchor.trackId === trackId);
    },
  }
})
