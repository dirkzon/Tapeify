import { defineStore } from 'pinia'
import type { Cassette } from '@/types/tapeify/models'
import { v4 as uuidv4 } from 'uuid';

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    cassettes: [
      { id: 'cassette-1', name: 'My First Cassette', capacityMs: 3600000 },
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
    addCassette() {
      this.cassettes.push({
        id: uuidv4(),
        name: "New Cassette",
        capacityMs: 3600000,
      })
    },
    removeCassette(cassetteId: string) {
      this.cassettes = this.cassettes.filter(cassette => cassette.id !== cassetteId)
    },
    updateName(cassetteId: string, newName: string) {
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
