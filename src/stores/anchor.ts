import { defineStore } from 'pinia'
import type { Anchor } from '@/types/tapeify/models'

export const useAnchorsStore = defineStore('anchors', {
  state: () => ({
    anchors: [
      {
        cassetteId: 'cassette_2',
        sideIndex: 0,
        positionIndex: 3,
        trackId: '5DnVR3FYEj7wcpPCWrFfYo',
        locked: true
      }
    ] as Anchor[],
  }),

  getters: {
  },

  actions: {
    // addAnchor(trackId: string, cassetteId: string, sideIndex: number, positionIndex: number) {
    //   if (!this.anchors[cassetteId]) this.anchors[cassetteId] = {}

    //   if (this.anchors[cassetteId][trackId]) {
    //     console.warn(`Track ${trackId} already anchored in cassette ${cassetteId}`)
    //     return
    //   }

    //   const newAnchor: Anchor = {
    //     cassetteId,
    //     sideIndex,
    //     positionIndex,
    //     trackId,
    //     locked: false
    //   }

    //   this.anchors[cassetteId][trackId] = newAnchor
    // },

    // removeAnchor(cassetteId: string, trackId: string) {
    //   if (!this.anchors[cassetteId]?.[trackId]) {
    //     console.warn(`Track ${trackId} not anchored in cassette ${cassetteId}`)
    //     return
    //   }

    //   delete this.anchors[cassetteId][trackId]
    // },

    // clearCassette(cassetteId: string) {
    //   delete this.anchors[cassetteId]
    // },
  }
})
