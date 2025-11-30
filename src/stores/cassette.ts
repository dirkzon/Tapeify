import { defineStore } from 'pinia'
import type { Cassette } from '@/types/tapeify/models'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    cassettes: [
      {
        id: 'cassette_1',
        name: 'My First Cassette',
        totalDurationMs: 60000 * 30,
      },
      {
        id: 'cassette_2',
        name: 'My second Cassette',
        totalDurationMs: 60000 * 60,
      },
    ] as Cassette[],
  }),
  getters: {
    getCassetteById: (state) => {
      return (cassetteId: string) => {
        return state.cassettes.find(cassette => cassette.id === cassetteId)
      }
    }
  },
  actions: {

  },
})
