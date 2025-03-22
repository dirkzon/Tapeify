import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { SortType, type TrackSorter } from '@/helpers/sorting/trackSorter'
import { GreedySort } from '@/helpers/sorting/greedySort'
import { KeepTrackOrder } from '@/helpers/sorting/keepTrackOrder'
import { useCassetteStore } from './cassette'

const STORE_NAME = 'sorting'

export const useSortingStore = defineStore(STORE_NAME, {
  state: () => ({
    sorters: [new GreedySort(), new KeepTrackOrder()] as TrackSorter[],
    selectedSortType: SortType.Greedy,
  }),
  getters: {
    getSortingTypes(state): SortType[] {
      return state.sorters.map((sorter) => sorter.type)
    },
    getSelectedSortType(state): SortType {
      return state.selectedSortType
    }
  },
  actions: {
    sortTracksInSides() {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassetteStore()

      const trackSorter = this.sorters.find((sorter: { type: SortType }) => sorter.type === this.selectedSortType) || this.sorters[0]

      const sides = trackSorter.sortTracksInSides(
        [...cassetteStore.getSides],
        [...tracksStore.getTracks]
      )
      for (let i = 0; i < sides.length; i++) {
        cassetteStore.SetSide(sides[i], i)
      }
    },
    setSelectedSortType(sortType: SortType) {
      this.selectedSortType = sortType
    }
  }
})
