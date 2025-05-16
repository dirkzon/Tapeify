import { GreedySort } from "./greedySort";
import { KeepTrackOrder } from "./keepTrackOrder";
import { SortType, type TrackSorter } from "./trackSorter";

const sorterFactories: { [key in SortType]: (count: number) => TrackSorter } = {
    [SortType.Greedy]: (count) => new GreedySort(count),
    [SortType.KeepOrder]: (count) => new KeepTrackOrder(count),
};

export function CreateTrackSorter(type: SortType, sidesCount: number): TrackSorter {
    const factory = sorterFactories[type]
    return factory(sidesCount)
}
