import type { TapeSideLayout } from "@/types/tapeify/models";
import { TapeSide } from "@/utils/sorting/tapeSideLayout";
import { defineStore } from "pinia";
import { useCassettesStore } from "./cassette";
import { UseTracksStore } from "./tracks";
import { useAnchorsStore } from "./anchor";
import { CreateTrackSorter } from "@/utils/sorting/trackSorterFactory";

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
    }
  },
  actions: {
    sortTracks() {
      const cassetteStore = useCassettesStore()
      const trackStore = UseTracksStore()
      const anchorsStore = useAnchorsStore()

      const sides: TapeSide[] = []

      for (const cassette of cassetteStore.cassettes) {
        for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
          const side = new TapeSide(cassette, sideIndex)
          sides.push(side)
        }
      }

      const trackSorter = CreateTrackSorter(this.selectedSortType, sides);

      const anchored_tracks = trackSorter.prepackAnchoredTracks(trackStore.tracks, anchorsStore.anchors)
      const unanchored_tracks = trackStore.tracks.filter(t => !anchored_tracks.includes(t))
      trackSorter.sortTracks(sides, unanchored_tracks)

      this.layout = sides.map(side => ({
        cassetteId: side.getCassetteId(),
        sideIndex: side.getSideIndex(),
        tracks: side.toArray(),
        durationMs: side.getUsedMs(),
      }))
    },
  }
})