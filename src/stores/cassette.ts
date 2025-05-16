import { defineStore } from 'pinia'
import { type Track } from './tracks'

const STORE_NAME = 'cassette'

export interface CassetteSide {
  tracks: Track[]
  duration_ms: number
}

export const useCassetteStore = defineStore(STORE_NAME, {
  state: () => ({
    sides: [
      {
        tracks: [],
        duration_ms: 0,
      },
      {
        tracks: [],
        duration_ms: 0,
      }
    ] as CassetteSide[]
  }),
  getters: {
    getSides(state): CassetteSide[] {
      return state.sides
    }
  },
  actions: {
    ClearCassette() {
      this.sides = []
    },
    PushNewSide(newSide: CassetteSide) {
      this.sides.push(newSide)
    },
    AddEmptySide() {
      this.sides.push({
        tracks: [],
        duration_ms: 0,
      })
    },
    DeleteSide(index: number) {
      this.sides.splice(index, 1)
    },
    ResetSides() {
      this.sides = [
        {
          tracks: [],
          duration_ms: 0,
        },
        {
          tracks: [],
          duration_ms: 0,
        }
      ] as CassetteSide[]
    }
  }
})
