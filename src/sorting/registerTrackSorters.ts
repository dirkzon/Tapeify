import { trackSorterRegistry } from './trackSorterRegistry';
import { GreedySort } from './greedySort';
import { KeepTrackOrder } from './keepTrackOrder';

trackSorterRegistry.register({
    meta: {
        type: "greedy",
        name: "Greedy Sort",
        description: "Place longest tracks into sides with most remaining time."
    },
    create: (sides) => new GreedySort(sides),
});

trackSorterRegistry.register({
    meta: {
        type: "keep-order",
        name: "Keep Track Order",
        description: "Preserve original track order."
    },
    create: (sides) => new KeepTrackOrder(sides),
});