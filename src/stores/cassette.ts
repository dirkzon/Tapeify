import { defineStore } from 'pinia'
import type { Cassette } from '@/types/tapeify/models'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    cassettes: [
      {
        id: 'cassette_1',
        name: 'My First Cassette',
        totalDurationMs: 3600000, // 60 minutes
      },
    ] as Cassette[],
  }),
  getters: {

  },
  actions: {

  },
})
