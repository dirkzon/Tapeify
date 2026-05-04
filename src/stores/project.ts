import type { Source } from "@/types/tapeify/models";
import { defineStore } from "pinia";

export const useProjectStore = defineStore('project', {
    state: () => ({
        sources: {} as Record<string, Source>,
        selectedSources: [] as string[],
    }),
    getters: {
        hasSources: (state) => Object.keys(state.sources).length > 0,
    },
    actions: {
        addSource(source: Source, id: string) {
            this.sources[id] = source;
            if (!this.selectedSources.includes(id)) {
                this.selectedSources.push(id);
            }
        },
        removeSource(id: string) {
            delete this.sources[id];
            this.selectedSources = this.selectedSources.filter(sourceId => sourceId !== id);
        }
    }
})