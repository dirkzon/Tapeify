<script lang="ts" setup>
import { computed } from 'vue'
import { useCassettesStore } from '@/stores/cassette'
import { useProjectStore } from '@/stores/project'

const cassetteStore = useCassettesStore()
const projectStore = useProjectStore()

const projectHasAlerts = computed(() => Object.keys(cassetteStore.alerts).length > 0)
</script>

<template>
    <v-dialog max-width="420">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" icon="mdi-upload-multiple" size="small" variant="text" :disabled="!projectStore.hasSources" />
        </template>

        <template v-slot:default="{ isActive }">
            <v-card elevation="6">
                <v-card-title class="text-h6">
                    Upload Cassette
                </v-card-title>
                <v-card-subtitle>
                    Review the cassette(s) before uploading to Spotify.
                </v-card-subtitle>

                <v-divider />

                <v-card-item class="pa-4" v-if="projectHasAlerts">
                    <div class="text-h6">Issues</div>
                    <div class="text-body-2">Fix these issues before uploading.</div>

                    <v-list density="compact" lines="two">
                        <v-list-item v-for="(alert, id) in cassetteStore.alerts" :key="id">
                            <template v-slot:append>
                                <v-icon icon="mdi-alert-circle" color="warning"></v-icon>
                            </template>
                            <v-list-item-title>{{ cassetteStore.getCassetteById(id)!.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ alert.message }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                    <v-divider />
                </v-card-item>

                <!-- <v-card-item class="pa-4">
                    <div class="text-h6">Playlists</div>
                    <div class="text-body-2">Each side of a cassette will be uploaded as a separate playlist.</div>

                    <v-list density="compact" lines="two">
                        <v-list-item v-for="(alert, id) in cassetteStore.alerts" :key="id">
                            <template v-slot:append>
                                <v-icon icon="mdi-alert-circle" color="warning"></v-icon>
                            </template>
                            <v-list-item-title>{{ cassetteStore.getCassetteById(id)!.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ alert.message }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                    <v-divider />
                </v-card-item> -->

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                    <v-btn :disabled="projectHasAlerts" variant="text" @click="cassetteStore.uploadCassette">
                        Upload
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
