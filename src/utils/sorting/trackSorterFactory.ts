import { GreedySort } from "./greedySort";
import { KeepTrackOrder } from "./keepTrackOrder";
import { type TrackSorter } from "./trackSorter";

const sorterFactories: { [key in SortType]: (count: number) => TrackSorter } = {
    [SortType.Greedy]: (count) => new GreedySort(count),
    [SortType.KeepOrder]: (count) => new KeepTrackOrder(count),
};

export function CreateTrackSorter(type: string): TrackSorter {
    const factory = sorterFactories[type]
    if (!factory) throw new Error(`Invalid SortType: ${type}`);
    return factory
}
