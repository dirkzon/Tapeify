import { defineStore } from 'pinia'
import { UseTracksStore, type Track } from './tracks'
import type { SortType, TrackSorter } from '@/helpers/sorting/trackSortInterface'
import { GreedySort } from '@/helpers/sorting/greedySort'
import { KeepTrackOrder } from '@/helpers/sorting/keepTrackOrder'
import { useCassetteStore } from './cassette'

const STORE_NAME = 'sorting'

export const useSortingStore = defineStore(STORE_NAME, {
  state: () => ({
    sorters: [new GreedySort(), new KeepTrackOrder()] as TrackSorter[]
  }),
  getters: {
    getSortingTypes(state): SortType[] {
      return state.sorters.map((sorter) => sorter.type)
    }
  },
  actions: {
    sortTracksInSides(sortType: SortType) {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassetteStore()

      // prevent reference
      const tracks = [...tracksStore.getTracks] as Track[]

      const trackSorter = this.sorters.find((sorter) => sorter.type === sortType) || this.sorters[0]

      const sides = trackSorter.sortTracksInSides(cassetteStore.getSides, tracks)
      console.log(sides)
      cassetteStore.SetSides(sides)
    }
  }
})
