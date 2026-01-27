import type { TapeSideLayout } from "@/types/tapeify/models";
import { TapeSide } from "@/utils/sorting/tapeSideLayout";
import { defineStore } from "pinia";
import { useCassettesStore } from "./cassette";
import { useTracksStore } from "./tracks";
import { useAnchorsStore } from "./anchor";
import { trackSorterRegistry } from "@/utils/sorting/trackSorterRegistry";

export const useSortingStore = defineStore('sorting', {
  state: () => ({
    layout: [] as TapeSideLayout[],
    selectedSortType: 'greedy',
  }),
  getters: {
    getLayoutByCassetteId: (state) => {
      return (cassetteId: string) => {
        return state.layout.filter(side => side.cassetteId === cassetteId)
      }
    },
    getLayoutbyCassetteAndSide: (state) => {
      return (cassetteId: string, sideIndex: number) => {
        return state.layout.find(side => side.cassetteId === cassetteId && side.sideIndex === sideIndex)
      }
    },
    getTracksIdsBetweenTracks: (state) => {
      return (start: string, end: string): string[] => {
        const allTracks = state.layout.flatMap(l => l.trackIds)

        const startIndex = allTracks.indexOf(start)
        const endIndex = allTracks.indexOf(end)

        if (startIndex === -1 || endIndex === -1) return []
        if (startIndex > endIndex) return []

        return allTracks.slice(startIndex, endIndex + 1)
      }
    }
  },
  actions: {
    sortTracks() {
      const cassetteStore = useCassettesStore()
      const trackStore = useTracksStore()
      const anchorsStore = useAnchorsStore()

      const sides: TapeSide[] = []

      for (const cassette of cassetteStore.cassettes) {
        for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
          const side = new TapeSide(cassette, sideIndex)
          sides.push(side)
        }
      }

      const trackSorter = trackSorterRegistry.create(this.selectedSortType, sides)

      const tracks = trackStore.availableTracks

      const anchored_tracks = trackSorter.prepackAnchoredTracks(tracks, anchorsStore.anchors)
      const unanchored_tracks = tracks.filter(t => !anchored_tracks.includes(t))
      trackSorter.sortTracks(sides, unanchored_tracks)

      this.layout = sides.map(side => ({
        cassetteId: side.getCassetteId(),
        sideIndex: side.getSideIndex(),
        trackIds: side.toArray(),
        durationMs: side.getUsedMs(),
      }))
    },
    setSortType(type: string) {
      if (!trackSorterRegistry.list().some(s => s.type === type)) {
        throw new Error(`Unknown sorter type: ${type}`);
      }
      this.selectedSortType = type;
      this.sortTracks();
    },

    getAvailableSorters() {
      return trackSorterRegistry.list();
    }
  }
})
