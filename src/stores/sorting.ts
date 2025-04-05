import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { SortType, type TrackSorter } from '@/helpers/sorting/trackSorter'
import { GreedySort } from '@/helpers/sorting/greedySort'
import { KeepTrackOrder } from '@/helpers/sorting/keepTrackOrder'
import { useCassetteStore } from './cassette'
import type { Track } from '@/stores/tracks'

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

      cassetteStore.clearSidesTracks()
      
      const trackSorter = this.sorters.find((sorter: { type: SortType }) => sorter.type === this.selectedSortType) || this.sorters[0]

      trackSorter.PrePackAnchoredTracks([...cassetteStore.getSides], [...tracksStore.anchoredTracks])
      trackSorter.sortUnanchoredTracks([...tracksStore.unanchoredTracks])
      trackSorter.ClearEmptyValues()
          
      for (let i = 0; i < trackSorter.cassetteSides.length; i++) {
        cassetteStore.SetSide(trackSorter.cassetteSides[i], i)
      }
    },
    setSelectedSortType(sortType: SortType) {
      this.selectedSortType = sortType
    }
  }
})
