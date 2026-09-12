import type { Source } from "@/types/tapeify/models";
import { defineStore } from "pinia";

export const useProjectStore = defineStore('project', {
    state: () => ({
        sources: {} as Record<string, Source>,
        selectedSources: {} as Record<string, string>,
        drawerOpen: false
    }),
    getters: {
        hasSources: (state) => Object.keys(state.sources).length > 0,
        sourceNames: (state) => Object.keys(state.sources),
        selectedSourceIds: (state) => Object.keys(state.selectedSources)
    },
    actions: {
        addSource(source: Source, id: string) {
            this.sources[id] = source;
        },
        removeSource(id: string) {
            delete this.sources[id];
        },
        selectSource(id: string, name: string) {
            if (this.selectedSourceIds.includes(id)) return;
            this.selectedSources[id] = name;
        },
        deSelectSource(id: string) {
            delete this.selectedSources[id]
        }
    }
})