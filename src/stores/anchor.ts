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
    anchorTrack(trackId: string, anchor: Anchor) {
      this.anchors[trackId] = anchor
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
    getTrackIdByAnchor(anchor: Anchor): string | undefined {
      for (const [trackId, a] of Object.entries(this.anchors)) {
        if (a.cassetteId === anchor.cassetteId && a.sideIndex === anchor.sideIndex && a.position === anchor.position) {
          return trackId
        }
      }
      return undefined
    },
    _switchAnchors(trackId1: string, trackId2: string) {
      const anchor1 = this.anchors[trackId1]
      const anchor2 = this.anchors[trackId2]
      if (!anchor1 || !anchor2) return

      const temp = { ...anchor1 }
      this.anchors[trackId1] = { ...anchor2 }
      this.anchors[trackId2] = temp
    },
    moveAnchorUp(trackId: string) {
      const anchor = this.anchors[trackId]
      if (!anchor) return

      var newPostiion = anchor.position - 1
      if (newPostiion < 0) {
        newPostiion = 0
      }

      const blockingTrack = this.getTrackIdByAnchor({
        cassetteId: anchor.cassetteId,
        sideIndex: anchor.sideIndex,
        position: newPostiion,
      })
      if (blockingTrack) {
        this._switchAnchors(trackId, blockingTrack)
      } else {
        anchor.position = newPostiion
      }
    },
    moveAnchorDown(trackId: string, maxPosition: number) {
      const anchor = this.anchors[trackId]
      if (!anchor) return

      var newPostiion = anchor.position + 1
      if (newPostiion > maxPosition) {
        newPostiion = maxPosition
      }

      const blockingTrack = this.getTrackIdByAnchor({
        cassetteId: anchor.cassetteId,
        sideIndex: anchor.sideIndex,
        position: newPostiion,
      })
      if (blockingTrack) {
        this._switchAnchors(trackId, blockingTrack)
      } else {
        anchor.position = newPostiion
      }
    },
  }
})
