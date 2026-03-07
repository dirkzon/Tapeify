import { defineStore } from 'pinia'
import type { Anchor } from '@/types/tapeify/models'

export const useAnchorsStore = defineStore('anchors', {
  state: () => ({
    anchors: {} as Record<string, Anchor>,
  }),

  getters: {
    isTrackAnchored: (state) => (trackId: string): boolean => {
      return state.anchors.hasOwnProperty(trackId)
    },
    getAnchorByTrackId: (state) => (trackId: string): Anchor | undefined => {
      return state.anchors[trackId]
    },
  },
  actions: {
    anchorTrack(anchor: Anchor) {
      this.anchors[anchor.trackId] = anchor
    },
    removeAnchor(trackId: string) {
      delete this.anchors[trackId]
    },
    removeAnchoresByCassetteId(cassetteId: string) {
      for (const [key, anchor] of Object.entries(this.anchors)) {
        if (anchor.cassetteId === cassetteId) {
          delete this.anchors[key]
        }
      }
    },
    removeAnchorsByTapeSide(cassetteId: string, sideIndex: number) {
      for (const [key, anchor] of Object.entries(this.anchors)) {
        if (anchor.cassetteId === cassetteId && anchor.sideIndex === sideIndex) {
          delete this.anchors[key]
        }
      }
    },
  }
})
