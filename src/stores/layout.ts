import type { CassetteLayout, TapeSideLayout, TrackLocation } from "@/types/tapeify/models"
import { defineStore } from "pinia"
import { useCassettesStore } from "./cassette";
import { useTracksStore } from "./tracks";
import { useAnchorsStore } from "./anchor";
import { useProjectStore } from "./project";
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
            this.calculateLayout();
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

            const sides: Side[] = cassetteStore.cassettes.flatMap(cassette =>
                Array.from({ length: cassette.sidesCount }, (_, sideIndex) => new Side(cassette, sideIndex))
            )

            const trackSorter = trackSorterRegistry.create(this.selectedSortType, sides)

            const availableTracks = trackStore.availableTracks
            const tracksInSelectedOrigins = availableTracks.filter(track =>
                projectStore.selectedSources.includes(track.source)
            )

            trackSorter._prepackAnchoredTracks(tracksInSelectedOrigins, anchorsStore.anchors)

            const tracksToSort = tracksInSelectedOrigins.filter(t => anchorsStore.anchors[t.id] === undefined)
            trackSorter.sortTracks(tracksToSort)

            this._buildLayoutsAndTracks(sides)
        },
        _buildLayoutsAndTracks(sides: Side[]) {
            const sideLayouts: TapeSideLayout[] = sides.map((side, i) => ({
                trackIds: side.toFlatArrayTrackIds(),
                columnIndex: i,
                durationMs: side.durationMs,
                sideIndex: side.sideIndex,
            }))

            this.cassettesLayout = sideLayouts.reduce<Record<string, CassetteLayout>>(
                (acc, sideLayout, idx) => {
                    const cassetteId = sides[idx].cassette.id;

                    acc[cassetteId] ??= { sides: [] };
                    acc[cassetteId].sides.push(sideLayout);

                    return acc;
                },
                {}
            );

            this.orderedTracks = sides.flatMap(side => side.toFlatArrayTrackIds())

            this.trackLocations = sides
                .flatMap(side => {
                    const ids = side.toFlatArrayTrackIds()
                    return ids.map((trackId, position) => ({
                        trackId,
                        cassetteId: side.cassette.id,
                        sideIndex: side.sideIndex,
                        position,
                    }))
                })
                .reduce<Record<string, TrackLocation>>((acc, loc) => {
                    acc[loc.trackId] = {
                        cassetteId: loc.cassetteId,
                        sideIndex: loc.sideIndex,
                        position: loc.position,
                    }
                    return acc
                }, {})
        },
    }
})