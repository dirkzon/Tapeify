import type { Origin } from "@/types/tapeify/models";
import { defineStore } from "pinia";

export const useProjectStore = defineStore('project', {
    state: () => ({
        origins: {} as Record<string, Origin>,
        selectedOrigins: [] as string[],
    }),
    getters: {
        hasOrigins: (state) => Object.keys(state.origins).length > 0,
    },
    actions: {
        addOrigin(origin: Origin, id: string) {
            this.origins[id] = origin;
            if (!this.selectedOrigins.includes(id)) {
                this.selectedOrigins.push(id);
            }
        },
        removeOrigin(id: string) {
            delete this.origins[id];
            this.selectedOrigins = this.selectedOrigins.filter(originId => originId !== id);
        }
    }
})