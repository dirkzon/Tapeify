import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { SortType } from '@/utils/sorting/trackSorter'
import { useCassetteStore } from './cassette'
import { CreateTrackSorter } from '@/utils/sorting/trackSorterFactory'

const STORE_NAME = 'sorting'

export const useSortingStore = defineStore(STORE_NAME, {
  state: () => ({
    selectedSortType: SortType.Greedy,
  }),
  getters: {
    getSortingTypes(): SortType[] {
      return Object.values(SortType)
    },
    getSelectedSortType(state): SortType {
      return state.selectedSortType
    }
  },
  actions: {
    sortTracksInSides() {
      const tracksStore = UseTracksStore()
      const cassetteStore = useCassetteStore()

      const sidesCount = cassetteStore.sides.length
      cassetteStore.ClearCassette()
      
      const trackSorter = CreateTrackSorter(this.selectedSortType, sidesCount)
      trackSorter.PrePackAnchoredTracks([...tracksStore.anchoredTracks])
      trackSorter.sortUnanchoredTracks([...tracksStore.unanchoredTracks])
      trackSorter.ClearEmptyValues()
          
      for (let i = 0; i < trackSorter.cassetteSides.length; i++) {
        cassetteStore.PushNewSide(trackSorter.cassetteSides[i])
      }
    },
    setSelectedSortType(sortType: SortType) {
      this.selectedSortType = sortType
    }
  }
})
