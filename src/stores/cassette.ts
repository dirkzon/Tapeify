import { defineStore } from 'pinia'
import type { Cassette, TapeSide } from '@/types/tapeify/models'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    cassettes: {} as Record<string, Cassette>,
    sidesByCassette: {} as Record<string, TapeSide>,
  }),
  getters: {

  },
  actions: {

  },
})
