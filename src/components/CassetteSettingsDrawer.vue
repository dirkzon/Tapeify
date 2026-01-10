<script setup lang="ts">
import { useSortingStore } from '@/stores/sorting';

const sortingStore = useSortingStore()

const route = useRoute()
const showDrawer = computed(() => route.name === '/CassetteView')

const availableSorters = sortingStore.getAvailableSorters()
const selectedSortType = computed({
  get: () => sortingStore.selectedSortType,
  set: (val: string) => sortingStore.setSortType(val)
})
</script>

<template>
    <v-navigation-drawer location="left" class="pa-4" color="pink" permanent v-if="showDrawer">
        <v-select v-model="selectedSortType" :items="availableSorters" item-value="type" label="Track Sorter"
            item-title="name">
            <template v-slot:item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
            </template>
        </v-select>
    </v-navigation-drawer>
</template>