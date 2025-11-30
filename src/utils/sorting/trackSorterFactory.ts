import { GreedySort } from "./greedySort";
import { KeepTrackOrder } from "./keepTrackOrder";
import type { TrackSorter } from "./trackSorter";
import type { TapeSide } from "./tapeSideLayout";

const sorterFactories: Record<string, (sides: TapeSide[]) => TrackSorter> = {
  "greedy":      (sides) => new GreedySort(sides),
  "keep-order":  (sides) => new KeepTrackOrder(sides),
};

export function CreateTrackSorter(type: string, sides: TapeSide[]): TrackSorter {
  const factory = sorterFactories[type];
  if (!factory) {
    throw new Error(`Invalid SortType: ${type}`);
  }
  return factory(sides);
}
