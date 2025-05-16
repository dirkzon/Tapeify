import { GreedySort } from "./greedySort";
import { KeepTrackOrder } from "./keepTrackOrder";
import { SortType, type TrackSorter } from "./trackSorter";

const sorterFactories: { [key in SortType]: (count: number) => TrackSorter } = {
    [SortType.Greedy]: (count) => new GreedySort(count),
    [SortType.KeepOrder]: (count) => new KeepTrackOrder(count),
};

export function CreateTrackSorter(type: SortType, sidesCount: number): TrackSorter {
    if (type == undefined) sorterFactories[SortType.Greedy]
    const factory = sorterFactories[type]
    if (!factory) throw new Error(`Invalid SortType: ${type}`);
    return factory(sidesCount)
}
