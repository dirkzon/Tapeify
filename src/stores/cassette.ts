import { defineStore } from 'pinia'
import { type Track } from './tracks'
import { v4 } from 'uuid'

const STORE_NAME = 'cassette'

export interface CassetteSide {
  tracks: Track[]
  duration_ms: number
  id: string
}

export const useCassetteStore = defineStore(STORE_NAME, {
  state: () => ({
    sides: [
      {
        tracks: [],
        duration_ms: 0,
        id: v4()
      },
      {
        tracks: [],
        duration_ms: 0,
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
    SetSide(newSide: CassetteSide, index: number) {
      this.sides[index] = newSide
    },
    AddSide() {
      this.sides.push({
        tracks: [],
        duration_ms: 0,
        id: v4()
      })
    },
    DeleteSide(id: string) {
      const index = this.sides.findIndex((side) => side.id === id)
      this.sides.splice(index, 1)
    },
    ResetSides() {
      this.sides = [
        {
          tracks: [],
          duration_ms: 0,
          id: v4()
        },
        {
          tracks: [],
          duration_ms: 0,
          id: v4()
        }
      ] as CassetteSide[]
    },
  }
})
