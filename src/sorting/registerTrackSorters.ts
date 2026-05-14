import { Registry } from './core/';
import { GreedySort, KeepTrackOrder } from './algorithms'; 

Registry.register({
    meta: {
        type: "greedy",
        name: "Greedy Sort",
        description: "Place longest tracks into sides with most remaining time."
    },
    create: (sides) => new GreedySort(sides),
});

Registry.register({
    meta: {
        type: "keep-order",
        name: "Keep Track Order",
        description: "Preserve original track order."
    },
    create: (sides) => new KeepTrackOrder(sides),
});