<script setup lang="ts">
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';
import { UseTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const sortingStore = useSortingStore()
const cassetteStore = useCassettesStore()
const tracksStore = UseTracksStore()

const route = useRoute()
const showDrawer = computed(() => route.name === '/CassetteView')

const availableSorters = sortingStore.getAvailableSorters()
const selectedSortType = computed({
    get: () => sortingStore.selectedSortType,
    set: (val: string) => sortingStore.setSortType(val)
})
</script>

<template>
    <v-navigation-drawer location="left" class="pa-4" color="primary" permanent v-if="showDrawer">
        <v-img :src="cassetteStore.metadata.image_url?.toString()" aspect-ratio="1" cover class="rounded-lg"/>
        <a :href="cassetteStore.metadata.original_item_url?.toString()" class="text-h5 clickable" target="_blank"
            v-text="cassetteStore.metadata.item_name"></a>
        <br />
        <a :href="cassetteStore.metadata.owner_url?.toString()" class="text-subtitle-1 clickable" target="_blank"
            v-text="cassetteStore.metadata.owner_display_name"></a>
        <v-divider class="my-4"/>
        <v-select v-model="selectedSortType" :items="availableSorters" item-value="type" label="Track Sorter"
            item-title="name">
            <template v-slot:item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
            </template>
        </v-select>
        <v-divider class="my-4"/>
        <div class="text-body-1"><strong>Cassettes:</strong> {{ cassetteStore.cassettes.length }}</div>
        <div class="text-body-1"><strong>Tracks:</strong> {{ tracksStore.tracks.length }}</div>
        <div class="text-body-1"><strong>Total Duration:</strong> {{formatDuration(tracksStore.totalDuration)}}</div>
    </v-navigation-drawer>
</template>

<style scoped>
.clickable {
    text-decoration: none;
    color: inherit;
}

.clickable:visited,
.clickable:hover,
.clickable:active {
    color: inherit;
}

.clickable:hover {
    text-decoration: underline;
}
</style>