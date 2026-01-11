<script setup lang="ts">
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';

const sortingStore = useSortingStore()
const cassetteStore = useCassettesStore()

const route = useRoute()
const showDrawer = computed(() => route.name === '/CassetteView')

const availableSorters = sortingStore.getAvailableSorters()
const selectedSortType = computed({
    get: () => sortingStore.selectedSortType,
    set: (val: string) => sortingStore.setSortType(val)
})

const openOriginalItemPage = () => {
    if (cassetteStore.metadata.original_item_url) {
        window.open(cassetteStore.metadata.original_item_url.toString(), '_blank')
    }
}

const openOwnerPage = () => {
    if (cassetteStore.metadata.owner_url) {
        window.open(cassetteStore.metadata.owner_url.toString(), '_blank')
    }
}
</script>

<template>
    <v-navigation-drawer location="left" class="pa-4" color="pink" permanent v-if="showDrawer">
        <v-img :src="cassetteStore.metadata.image_url?.toString()" aspect-ratio="1" cover @click="openOriginalItemPage" class="cassette-image"/>
        <h3 @click="openOwnerPage" class="clickable">{{ cassetteStore.metadata.owner_display_name }}</h3>
        <p>{{ cassetteStore.metadata.description }}</p>
        <v-divider class="my-4" />
        <v-select v-model="selectedSortType" :items="availableSorters" item-value="type" label="Track Sorter"
            item-title="name">
            <template v-slot:item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
            </template>
        </v-select>
    </v-navigation-drawer>
</template>

<style scoped>
.cassette-image {
  width: 100%;
  display: block;
  cursor: pointer;
}

.clickable {
  cursor: pointer;
}
</style>