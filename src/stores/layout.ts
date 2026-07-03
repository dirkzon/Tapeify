import type { CassetteLayout, TapeSideLayout, TrackLocation } from "@/types/tapeify/models"
import { defineStore } from "pinia"
import { useCassettesStore } from "./cassette";
import { useTracksStore } from "./tracks";
import { useAnchorsStore } from "./anchor";
import { useProjectStore } from "./project";
import { debounce } from "lodash";
import { trackSorterRegistry, type TrackSorterMetaData } from "@/sorting/core/trackSorterRegistry";
import { Side } from "@/sorting/core/side";

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
            this.calculateLayoutDebounced();
        },
        getAvailableSorters(): TrackSorterMetaData[] {
            return trackSorterRegistry.list();
        },
        calculateLayout() {
            const cassetteStore = useCassettesStore()
            const trackStore = useTracksStore()
            const anchorsStore = useAnchorsStore()
            const projectStore = useProjectStore()

            this.orderedTracks = []
            this.trackLocations = {}
            this.cassettesLayout = {}

            const sides: Side[] = []

            for (const cassette of cassetteStore.cassettes) {
                for (let sideIndex = 0; sideIndex < cassette.sidesCount; sideIndex++) {
                    const side = new Side(cassette, sideIndex)
                    sides.push(side)
                }
            }

            const trackSorter = trackSorterRegistry.create(this.selectedSortType, sides)

            const availableTracks = trackStore.availableTracks
            const tracksInSelectedOrigins = availableTracks.filter(track => projectStore.selectedSources.includes(track.source))

            trackSorter._prepackAnchoredTracks(tracksInSelectedOrigins, anchorsStore.anchors)
            const tracks_to_sort = tracksInSelectedOrigins.filter(t => anchorsStore.anchors[t.id] === undefined)
            trackSorter.sortTracks(tracks_to_sort)

            this._calculate_cassette_layout(sides)
            this._calculate_ordered_tracks(sides)
            this._calculate_track_locations(sides)
        },
        calculateLayoutDebounced: debounce(function (this: any) {
            this.calculateLayout()
        }, 2),
        _calculate_ordered_tracks(sides: Side[]) {
            sides.forEach(side => {
                this.orderedTracks.push(...side.toFlatArrayTrackIds())
            });
        },
        _calculate_track_locations(sides: Side[]) {
            sides.forEach(side => {
                const trackArray = side.toFlatArrayTrackIds()
                for (let i = 0; i < trackArray.length; i++) {
                    this.trackLocations[trackArray[i]] = {
                        cassetteId: side.cassette.id,
                        sideIndex: side.sideIndex,
                        position: i
                    }
                }
            })
        },
        _calculate_cassette_layout(sides: Side[]) {
            for (let i = 0; i < sides.length; i++) {
                const cassetteId = sides[i].cassette.id
                const sideLayout: TapeSideLayout = {
                    trackIds: sides[i].toFlatArrayTrackIds(),
                    columnIndex: i,
                    durationMs: sides[i].durationMs,
                    sideIndex: sides[i].sideIndex
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