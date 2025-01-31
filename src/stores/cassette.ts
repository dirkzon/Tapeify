import { defineStore } from 'pinia'
import { type Track } from './tracks'
import { v4 } from 'uuid'

const STORE_NAME = 'cassette'

export interface CassetteSide {
  tracks: Track[]
  duration_ms: number
  id: string
  index: number
}

export const useCassetteStore = defineStore(STORE_NAME, {
  state: () => ({
    sides: [
      {
        tracks: [],
        duration_ms: 0,
        index: 0,
        id: v4()
      },
      {
        tracks: [],
        duration_ms: 0,
        index: 1,
        id: v4()
      }
    ] as CassetteSide[]
  }),
  getters: {
    getSides(state): CassetteSide[] {
      if (!state.sides) return []
      else return state.sides
    }
  },
  actions: {
    clearSidesTracks() {
      for (const side of this.sides) {
        side.tracks = []
        side.duration_ms = 0
      }
    },
    SetSides(newSides: CassetteSide[]) {
      this.sides = newSides
    }
  }
})
