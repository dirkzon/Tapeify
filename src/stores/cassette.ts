import { defineStore } from 'pinia'
import type { Cassette } from '@/types/tapeify/models'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    cassettes: [
      {
        id: 'cassette_1',
        name: 'My First Cassette',
        capacityMs: 60000 * 30,
      },
      {
        id: 'cassette_2',
        name: 'My second Cassette',
        capacityMs: 60000 * 60,
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
    addCassette(cassette: Cassette) {
      this.cassettes.push(cassette)
    },
    removeCassette(cassetteId: string) {
      this.cassettes = this.cassettes.filter(cassette => cassette.id !== cassetteId)
    },
    updateCassetteName(cassetteId: string, newName: string) {
      const cassette = this.cassettes.find(cassette => cassette.id === cassetteId)
      if (cassette) {
        cassette.name = newName
      }
    },
    updateCapacity(cassetteId: string, newCapacityMs: number) {
      const cassette = this.cassettes.find(cassette => cassette.id === cassetteId)
      if (cassette) {
        cassette.capacityMs = newCapacityMs
      }
    },
  },
})
