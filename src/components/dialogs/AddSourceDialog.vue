<script setup lang="ts">
import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { usePlaylistsStore } from '@/stores/playlists'
import { useAlbumsStore } from '@/stores/album'
import { useLayoutStore } from '@/stores/layout'

const projectStore = useProjectStore()
const playlistStore = usePlaylistsStore()
const albumStore = useAlbumsStore()
const layoutStore = useLayoutStore()

const dialogOpen = ref(false)
const selectedTab = ref('user_playlists')
const loading = ref(false)

function closeDialog() {
    dialogOpen.value = false
}

async function importSources() {
    loading.value = true
    try {
        for (const id of projectStore.selectedSourceIds) {
            const source = projectStore.selectedSources[id]
            if (source.type == "playlist") {
                await playlistStore.FetchPlaylistTracks(id)
            } else {
                await albumStore.FetchAlbumTracks(id)
            }
        }
        layoutStore.calculateLayout()

        closeDialog()
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <v-dialog v-model="dialogOpen" max-width="800" scrollable>
        <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-playlist-plus" size="small" variant="text"
                aria-label="Add playlist or album source" />
        </template>

        <v-card rounded="lg">
            <v-card-item>
                <template #prepend>
                    <v-icon icon="mdi-playlist-plus" color="primary" class="mr-2" />
                </template>

                <v-card-title class="text-h6">
                    Add sources
                </v-card-title>

                <v-card-subtitle>
                    Select playlists or albums to add to your project
                </v-card-subtitle>
            </v-card-item>

            <v-divider />

            <v-tabs v-model="selectedTab" color="primary" grow density="comfortable">
                <v-tab value="user_playlists">
                    <v-icon start>mdi-playlist-music</v-icon>
                    My playlists
                </v-tab>

                <v-tab value="search_albums">
                    <v-icon start>mdi-album</v-icon>
                    Albums
                </v-tab>

                <v-tab value="search_playlists">
                    <v-icon start>mdi-playlist-music</v-icon>
                    Search playlists
                </v-tab>
            </v-tabs>

            <v-divider />

            <v-card-text class="pa-0">
                <v-tabs-window v-model="selectedTab">
                    <v-tabs-window-item value="user_playlists">
                        <UserPlaylistsTab />
                    </v-tabs-window-item>

                    <v-tabs-window-item value="search_albums">
                        <SearchAlbumsTab />
                    </v-tabs-window-item>

                    <v-tabs-window-item value="search_playlists">
                        <SearchPlaylistsTab />
                    </v-tabs-window-item>
                </v-tabs-window>

                <v-divider />

                <div class="pa-4">
                    <v-sheet v-if="Object.keys(projectStore.selectedSources).length" rounded="lg" class="pa-3">
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip v-for="[id, source] in Object.entries(
                                projectStore.selectedSources
                            )" :key="id" closable variant="tonal" color="primary"
                                @click:close="projectStore.deSelectSource(id)">
                                {{ source.name }}
                            </v-chip>
                        </div>
                    </v-sheet>

                    <v-alert v-else type="info" variant="tonal" density="comfortable">
                        No sources selected yet.
                    </v-alert>
                </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-4">
                <v-spacer />

                <v-btn variant="text" @click="closeDialog">
                    Cancel
                </v-btn>

                <v-btn color="primary" variant="flat" :loading="loading"
                    :disabled="!Object.keys(projectStore.selectedSources).length || loading" @click="importSources">
                    Add sources
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
