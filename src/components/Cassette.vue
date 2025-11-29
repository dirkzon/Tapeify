<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';

const cassetteStore = useCassettesStore()

const props = defineProps<{
    cassetteId: string
}>()

const cassette = computed(() => {
    return cassetteStore.getCassetteById(props.cassetteId)
})
</script>

<template>
    <v-card>
        <v-toolbar color="pink">
            <v-toolbar-title>{{ layout?.sideIndex}}</v-toolbar-title>
            <v-card-title>{{ cassette?.name }}</v-card-title>
            <v-card-subtitle>{{ cassette?.totalDurationMs }}</v-card-subtitle>
        </v-toolbar>
        <v-row align="stretch" class="cassette-row" no-gutters>
        <v-col cols="5" class="d-flex">
            <CassetteSide :cassetteId="cassetteId" :sideIndex="0" class="flex-grow-1" />
        </v-col>

        <v-col cols="auto" class="d-flex">
            <v-divider vertical class="full-height-divider" />
        </v-col>

        <v-col cols="5" class="d-flex">
            <CassetteSide :cassetteId="cassetteId" :sideIndex="1" class="flex-grow-1" />
        </v-col>
        </v-row>
    </v-card>
</template>

<style scoped>
.cassette-row {
    min-height: 200px;
    margin: 16px;
} 
</style>