import type { CassetteLayout, TapeSideLayout, TrackLocation } from "@/types/tapeify/models"
import { defineStore } from "pinia"
import { trackSorterRegistry } from "@/sorting/trackSorterRegistry";
import { useCassettesStore } from "./cassette";
import { useTracksStore } from "./tracks";
import { useAnchorsStore } from "./anchor";
import { TapeSide } from "@/sorting/tapeSideLayout";

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        orderedTracks: [] as string[],
        trackLocations: {} as Record<string, TrackLocation>,
        cassettesLayout: {} as Record<string, CassetteLayout>,
        selectedSortType: 'greedy'
    }),
    getters: {
        getLayoutByCassetteId: (state) => {
            return (cassetteId: string): CassetteLayout | undefined => {
                return state.cassettesLayout[cassetteId]
            }
        },
        getLayoutbyCassetteAndSide: (state) => {
            return (cassetteId: string, sideIndex: number): TapeSideLayout | undefined => {
                return state.cassettesLayout[cassetteId]?.sides?.[sideIndex]
            }
        },
        sideColumnIndex: (state) => {
            return (cassetteId: string, sideIndex: number): number | undefined => {
                return state.cassettesLayout[cassetteId]?.sides?.[sideIndex]?.columnIndex
            }
        },
        getTrackLayout: (state) => {
            return (trackId: string): TrackLocation | undefined => {
                return state.trackLocations[trackId]
            }
        },
        getTracksRange: (state) => {
            return (a: string, b: string): string[] => {
                const startIndex = state.orderedTracks.indexOf(a);
                const endIndex = state.orderedTracks.indexOf(b);

                if (startIndex === -1 || endIndex === -1) return [];

                const rangeStart = Math.min(startIndex, endIndex);
                const rangeEnd = Math.max(startIndex, endIndex);

                return state.orderedTracks.slice(rangeStart, rangeEnd + 1);
            }
        },
    },
    actions: {
        setSortType(type: string) {
            if (!trackSorterRegistry.list().some(s => s.type === type)) {
                throw new Error(`Unknown sorter type: ${type}`);
            }
            this.selectedSortType = type;
            this.calculateLayout();
        },
        getAvailableSorters() {
            return trackSorterRegistry.list();
        },
        calculateLayout() {
            const cassetteStore = useCassettesStore()
            const trackStore = useTracksStore()
            const anchorsStore = useAnchorsStore()

            this.orderedTracks = []
            this.trackLocations = {}
            this.cassettesLayout = {}

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

            this._calculate_cassette_layout(sides)
            this._calculate_ordered_tracks(sides)
            this._calculate_track_locations(sides)
        },
        _calculate_ordered_tracks(sides: TapeSide[]) {
            sides.forEach(side => {
                this.orderedTracks.push(...side.toArray())
            });
        },
        _calculate_track_locations(sides: TapeSide[]) {
            sides.forEach(side => {
                const trackArray = side.toArray()
                for (let i = 0; i < trackArray.length; i++) {
                    this.trackLocations[trackArray[i]] = {
                        cassetteId: side.getCassetteId(),
                        sideIndex: side.getSideIndex(),
                        position: i
                    }
                }
            })
        },
        _calculate_cassette_layout(sides: TapeSide[]) {
            for (let i = 0; i < sides.length; i++) {
                const cassetteId = sides[i].getCassetteId()
                const sideLayout: TapeSideLayout = {
                    trackIds: sides[i].toArray(),
                    columnIndex: i,
                    durationMs: sides[i].getUsedMs(),
                    sideIndex: sides[i].getSideIndex()
                }
                if (cassetteId in this.cassettesLayout) {
                    this.cassettesLayout[cassetteId].sides.push(sideLayout)
                } else {
                    this.cassettesLayout[cassetteId] = {
                        sides: [sideLayout]
                    }
                }
            }
        }
    }
})