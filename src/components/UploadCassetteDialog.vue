<script lang="ts" setup>
import { computed } from 'vue'
import { useCassettesStore } from '@/stores/cassette'

const cassetteStore = useCassettesStore()

const projectHasAlerts = computed(() => Object.keys(cassetteStore.alerts).length > 0)
</script>

<template>
    <v-dialog activator="parent" max-width="420">
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
                    <div class="text-h6">Issues detected</div>
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

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                    <v-btn :disabled="projectHasAlerts" variant="text" dark @click="cassetteStore.uploadCassette">
                        Upload
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
