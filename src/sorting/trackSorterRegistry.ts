import type { TapeSide } from "./tapeSideLayout";
import type { TrackSorter } from "./trackSorter";

export interface TrackSorterMetaData {
    type: string
    name: string
    description: string
}

type TrackSorterFactory = {
    create: (sides: TapeSide[]) => TrackSorter;
    meta: TrackSorterMetaData;
};

class TrackSorterRegistry {
    private sorters = new Map<string, TrackSorterFactory>();

    register(sorter: TrackSorterFactory) {
        this.sorters.set(sorter.meta.type, sorter);
    }

    create(type: string, sides: TapeSide[]) {
        const factory = this.sorters.get(type);
        if (!factory) throw new Error(`Unknown sorter: ${type}`);
        return factory.create(sides);
    }

    list(): TrackSorterMetaData[] {
        return Array.from(this.sorters.values()).map(s => s.meta);
    }
}

export const trackSorterRegistry = new TrackSorterRegistry();
