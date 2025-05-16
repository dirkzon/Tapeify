import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import { SortType } from '@/helpers/sorting/trackSorter'
import { useCassetteStore } from './cassette'
import { CreateTrackSorter } from '@/helpers/sorting/trackSorterFactory'

const STORE_NAME = 'sorting'

export const useSortingStore = defineStore(STORE_NAME, {
  state: () => ({
    selectedSortType: SortType.Greedy,
  }),
  getters: {
    getSortingTypes(state): String[] {
      return Object.keys(SortType)
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
    setSelectedSortType(type: String) {
      this.selectedSortType = SortType[type as keyof typeof SortType]
    }
  }
})
