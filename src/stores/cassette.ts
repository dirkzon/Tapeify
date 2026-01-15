import { defineStore } from 'pinia'
import type { Cassette, CassetteMetadata } from '@/types/tapeify/models'
import { v4 as uuidv4 } from 'uuid';
import { useSortingStore } from './sorting';

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    metadata: {} as CassetteMetadata,
    cassettes: [
      { id: 'default', name: 'My First Cassette', capacityMs: (90 * 60000) },
    ] as Cassette[],
    alerts: []
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
        name: `${this.metadata.item_name} ${this.cassettes.length + 1}`,
        capacityMs: 90 * 60000,
      })
    },
    removeCassette(cassetteId: string) {
      this.cassettes = this.cassettes.filter(cassette => cassette.id !== cassetteId)
    },
    updateName(cassetteId: string, newName: string) {
      const cassette = this.cassettes.find(cassette => cassette.id === cassetteId)
      if (cassette) {
        cassette.name = `${newName} ${this.cassettes.length}`
      }
    },
    updateCapacity(cassetteId: string, newCapacityMs: number) {
      const cassette = this.cassettes.find(cassette => cassette.id === cassetteId)
      if (cassette) {
        cassette.capacityMs = newCapacityMs
      }
    },
    updateMetadata(newMetadata: CassetteMetadata) {
      this.metadata = newMetadata
    },
    initAlerts() {
      const sortStore = useSortingStore()
      sortStore.$subscribe((_mutation, state) => {
        console.log(state)
      })
    },
  },
})
