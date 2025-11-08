import { defineStore } from 'pinia'
import type { Anchor } from '@/types/tapeify/models'

const STORE_NAME = 'anchors'

export const useCassetteStore = defineStore(STORE_NAME, {
  state: () => ({
    anchors: {} as Record<string, Anchor>,
  }),
  getters: {
    _getAnchorByTrackId: (state) => {
      return (id: string) => {
        return state.anchors[id]
      }
    },
    byCassette: (state) => (cassetteId: string) => state.anchors[cassetteId] || {},
    all: (state) => state.anchors,
  },
  actions: {
    AnchorTrack(track_id: string,  cassette_id: string, side_index: number, track_index: number) {
      if (this._getAnchorByTrackId(track_id) != undefined) {
        console.warn(`Track with id ${track_id} is already anchored`)
        return
      }

      const newAnchor: Anchor = {
        cassetteId: cassette_id,
        tapeSideIndex: side_index,
        positionIndex: track_index,
        locked: false
      }

      this.anchors[track_id] = newAnchor
    },
    UnAnchorTrack(track_id: string) {
      if (this._getAnchorByTrackId(track_id) == undefined) {
        console.warn(`Track with id ${track_id} is not anchored`)
        return
      }

      delete this.anchors[track_id]
    },
  }
})
